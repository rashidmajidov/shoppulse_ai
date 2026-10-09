"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApifyService = void 0;
const apify_client_1 = require("apify-client");
const env_1 = require("../config/env");
class ApifyService {
    client;
    constructor() {
        this.client = new apify_client_1.ApifyClient({
            token: env_1.config.apify.apiToken,
        });
    }
    /**
     * Fetches trending TikTok posts based on target hashtags
     * Uses Apify Actor without downloading heavy video files
     */
    async fetchTrendingPosts(hashtags = ['TikTokMadeMeBuyIt', 'ViralProducts', 'AmazonFinds'], resultsPerPage = 10) {
        if (env_1.config.mockExternalApis) {
            console.log('[ApifyService] Mock mode enabled - generating sample TikTok posts');
            return this.getMockPosts(hashtags);
        }
        if (!env_1.config.apify.apiToken) {
            throw new Error('APIFY_API_TOKEN is not configured');
        }
        console.log(`[ApifyService] Starting scraper for hashtags: ${hashtags.join(', ')} (Max: ${resultsPerPage})`);
        try {
            // Actor input configuration optimized for speed and low bandwidth
            const actorInput = {
                hashtags: hashtags.map(h => h.replace(/^#/, '')),
                resultsPerPage,
                shouldDownloadVideos: false, // CRITICAL: Do NOT download videos into Apify storage
                shouldDownloadCovers: false, // Save bandwidth
                shouldDownloadSlideshowImages: false,
                proxyConfiguration: {
                    useApifyProxy: true,
                },
            };
            // Call Apify actor
            const run = await this.client.actor(env_1.config.apify.actorId).call(actorInput);
            console.log(`[ApifyService] Actor run completed with ID: ${run.id}. Fetching dataset items...`);
            // Fetch items from the default dataset
            const { items } = await this.client.dataset(run.defaultDatasetId).listItems();
            console.log(`[ApifyService] Retrieved ${items.length} raw items from Apify dataset`);
            return this.normalizeApifyItems(items);
        }
        catch (error) {
            console.error('[ApifyService] Error executing Apify TikTok scraper:', error.message);
            throw new Error(`Apify scraping failed: ${error.message}`);
        }
    }
    /**
     * Normalizes different Apify scraper output schemas into uniform TikTokRawPost interface
     */
    normalizeApifyItems(rawItems) {
        const posts = [];
        for (const item of rawItems) {
            try {
                const postId = item.id || item.video_id || item.aweme_id || String(Date.now() + Math.random());
                // Extract video and audio URLs
                const videoUrl = item.webVideoUrl || item.videoUrl || item.video?.playAddr || item.video?.downloadAddr || '';
                const audioUrl = item.musicMeta?.playUrl || item.music?.playUrl || item.audioUrl || null;
                // Caption & hashtags
                const caption = item.text || item.desc || item.title || '';
                const rawHashtags = item.hashtags || item.textExtra || [];
                const hashtags = Array.isArray(rawHashtags)
                    ? rawHashtags.map((h) => (typeof h === 'string' ? h : h.name || h.hashtagName)).filter(Boolean)
                    : [];
                // Engagement metrics
                const playCount = Number(item.playCount || item.stats?.playCount || item.videoViewCount || 0);
                const likeCount = Number(item.diggCount || item.stats?.diggCount || item.likes || 0);
                const shareCount = Number(item.shareCount || item.stats?.shareCount || item.shares || 0);
                const commentCount = Number(item.commentCount || item.stats?.commentCount || item.comments || 0);
                // Filter out zero-engagement or broken items
                if (!videoUrl && !audioUrl)
                    continue;
                posts.push({
                    postId: String(postId),
                    videoUrl,
                    audioUrl,
                    caption,
                    hashtags,
                    playCount,
                    likeCount,
                    shareCount,
                    commentCount,
                    createTime: item.createTime || item.createdAt || new Date().toISOString(),
                    authorUsername: item.authorMeta?.name || item.author?.uniqueId || 'unknown',
                });
            }
            catch (err) {
                console.warn('[ApifyService] Skipping malformed item:', err);
            }
        }
        return posts;
    }
    /**
     * Realistic mock data generator for testing without spending credits
     */
    getMockPosts(hashtags) {
        return [
            {
                postId: 'tt-mock-73918239102',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                audioUrl: 'https://cdn.example.com/audio1.mp3',
                caption: 'This smartwatch saved my morning routine! AMOLED display and 14 day battery 🤯 #TikTokMadeMeBuyIt #AmazonFinds',
                hashtags: ['TikTokMadeMeBuyIt', 'AmazonFinds', 'Smartwatch'],
                playCount: 14800000,
                likeCount: 920000,
                shareCount: 184000,
                commentCount: 42000,
                createTime: Date.now() - 86400000 * 2,
                authorUsername: 'techfindsdaily',
            },
            {
                postId: 'tt-mock-83920193821',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                audioUrl: 'https://cdn.example.com/audio2.mp3',
                caption: 'Everyone kept gatekeeping this glow serum! 7 days results speaking for themselves ✨ #SkincareHacks #ViralProducts',
                hashtags: ['SkincareHacks', 'ViralProducts', 'GlassSkin'],
                playCount: 9400000,
                likeCount: 680000,
                shareCount: 120000,
                commentCount: 28000,
                createTime: Date.now() - 86400000 * 3,
                authorUsername: 'glowroutines',
            },
        ];
    }
}
exports.ApifyService = ApifyService;
