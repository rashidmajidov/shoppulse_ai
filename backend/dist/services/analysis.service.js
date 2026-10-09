"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisService = void 0;
const openai_1 = __importDefault(require("openai"));
const env_1 = require("../config/env");
class AnalysisService {
    openai;
    constructor() {
        this.openai = new openai_1.default({
            apiKey: env_1.config.openai.apiKey,
        });
    }
    /**
     * Calculates Virality Score (1 - 100)
     * Formula factors in:
     * 1. View-to-Like ratio (ideal: 8% - 15%+)
     * 2. Share-to-View ratio (viral velocity indicator, heavily weighted)
     * 3. Overall view volume scaling (logarithmic scale)
     */
    calculateViralityScore(post) {
        const views = Math.max(post.playCount, 1000);
        const likes = post.likeCount;
        const shares = post.shareCount;
        const comments = post.commentCount;
        // Engagement Ratios
        const likeRatio = likes / views; // Benchmark ~ 0.08
        const shareRatio = shares / views; // Benchmark ~ 0.015 (high signal)
        const commentRatio = comments / views; // Benchmark ~ 0.005
        // Weighted Engagement Score (0 - 50 pts)
        const engagementScore = Math.min(50, likeRatio * 200 + shareRatio * 1200 + commentRatio * 600);
        // Volume Scale (0 - 40 pts, log10 based)
        // 10K views -> ~16 pts, 1M views -> ~28 pts, 10M+ views -> 38-40 pts
        const volumeScore = Math.min(40, Math.log10(views) * 6);
        // Recency / Velocity Bonus (0 - 10 pts)
        const postAgeDays = post.createTime
            ? Math.max(1, (Date.now() - new Date(post.createTime).getTime()) / (1000 * 60 * 60 * 24))
            : 7;
        const recencyBonus = Math.max(0, 10 - postAgeDays * 0.8);
        const total = Math.round(engagementScore + volumeScore + recencyBonus);
        return Math.max(1, Math.min(100, total));
    }
    /**
     * Analyzes post transcript and metadata using GPT-4o
     * Extracts hook, problem-solution, CTA, and reusable script components
     */
    async analyzeTrend(post, transcript) {
        const viralityScore = this.calculateViralityScore(post);
        if (env_1.config.mockExternalApis) {
            console.log(`[AnalysisService] Mock mode: generating GPT-4o analysis for post ${post.postId}`);
            return {
                trendTitle: 'POV: Problem-Solver Viral Reveal',
                targetCategory: 'Tech & Gadgets',
                viralityScore,
                scriptHook: 'Stop scrolling if you need to fix your daily productivity! 🤯',
                scriptBody: 'Thanks to {product_name}, I save hours every single day. The best part is {feature_1} and {feature_2}.',
                scriptCta: 'Grab yours now with 40% off — link in bio before it sells out!',
                whyItWorks: 'High cognitive dissonance hook followed by direct practical relief.',
                soundName: 'Phonk Drive - Viral Drift Beat',
            };
        }
        if (!env_1.config.openai.apiKey) {
            throw new Error('OPENAI_API_KEY is not configured');
        }
        console.log(`[AnalysisService] Sending transcript & metadata to GPT-4o (Post ${post.postId})...`);
        const systemPrompt = `You are a world-class viral video marketing strategist and e-commerce copywriter.
Analyze the provided TikTok video metadata and spoken audio transcript.
Deconstruct this viral video into actionable marketing assets that store owners and entrepreneurs can adapt for their own products.

Return ONLY a valid JSON object matching this exact schema:
{
  "trendTitle": "Concise 4-8 word title for this viral format (e.g. 'POV: Solution Reveal', 'TikTok Made Me Buy It Review')",
  "targetCategory": "Best suited e-commerce niche (e.g. 'Tech & Gadgets', 'Beauty & Skincare', 'Kitchen & Home', 'Fashion & Apparel', 'Fitness & Wellness')",
  "scriptHook": "The exact attention-grabbing 0-3 second spoken/visual opening hook (max 15 words)",
  "scriptBody": "The 3-12 second problem-solution core angle with placeholders {product_name}, {feature_1}, and {feature_2}",
  "scriptCta": "The 12-15 second high-converting call to action incentive",
  "whyItWorks": "1-2 sentence explanation of the psychological trigger (curiosity gap, social proof, pattern interrupt, FOMO)",
  "soundStyle": "Suggested audio vibe (e.g. 'Upbeat Phonk', 'Chill Lo-Fi', 'High Energy Drop')"
}`;
        const userPrompt = `
VIDEO METADATA:
- Post ID: ${post.postId}
- Caption: ${post.caption}
- Hashtags: ${post.hashtags.join(', ') || 'N/A'}
- Play Count: ${post.playCount.toLocaleString()}
- Like Count: ${post.likeCount.toLocaleString()}
- Share Count: ${post.shareCount.toLocaleString()}
- Calculated Virality Score: ${viralityScore}/100

AUDIO TRANSCRIPT:
"${transcript || post.caption || 'Product showcase review'}"

Extract the viral marketing components now:`;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.7,
                max_tokens: 800,
            });
            const rawContent = response.choices[0]?.message?.content || '{}';
            const parsed = JSON.parse(rawContent);
            return {
                trendTitle: parsed.trendTitle || 'Viral E-Commerce Showcase',
                targetCategory: parsed.targetCategory || 'General',
                viralityScore,
                scriptHook: parsed.scriptHook || post.caption.slice(0, 80),
                scriptBody: parsed.scriptBody || 'Experience the difference with {product_name} featuring {feature_1}.',
                scriptCta: parsed.scriptCta || 'Tap the link in bio to get yours before stock runs out!',
                whyItWorks: parsed.whyItWorks || 'Pattern interrupt driving high immediate retention.',
                soundName: parsed.soundStyle || 'Trending Social Audio',
            };
        }
        catch (error) {
            console.error(`[AnalysisService] GPT-4o analysis failed for post ${post.postId}:`, error.message);
            // Fallback response so pipeline continues smoothly
            return {
                trendTitle: 'Viral Social Trend',
                targetCategory: 'General',
                viralityScore,
                scriptHook: post.caption.slice(0, 90) || 'You need to see this!',
                scriptBody: 'Discover {product_name} with {feature_1}.',
                scriptCta: 'Limited time offer — link in bio!',
                whyItWorks: 'Direct social proof and visual demonstration.',
            };
        }
    }
}
exports.AnalysisService = AnalysisService;
