import { Request, Response } from 'express';
import { DatabaseService } from '../services/db.service';
import { TrendPipeline } from '../pipeline/trendPipeline';

export class TrendsController {
  private dbService: DatabaseService;
  private pipeline: TrendPipeline;

  constructor() {
    this.dbService = new DatabaseService();
    this.pipeline = new TrendPipeline(undefined, undefined, undefined, this.dbService);
  }

  /** GET /api/trends */
  getTrends = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, platform, search, minVirality, limit, offset, sortBy, sortOrder } = req.query;
      const result = await this.dbService.getTrends({
        category: category as string,
        platform: platform as string,
        search: search as string,
        minVirality: minVirality ? parseInt(minVirality as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : 20,
        offset: offset ? parseInt(offset as string, 10) : 0,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
      });
      res.status(200).json({ success: true, count: result.data.length, total: result.total, data: result.data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve trends', error: error.message });
    }
  };

  /** GET /api/trends/:id */
  getTrendById = async (req: Request, res: Response): Promise<void> => {
    try {
      const trend = await this.dbService.getTrendById(req.params.id);
      if (!trend) { res.status(404).json({ success: false, message: `Trend ${req.params.id} not found` }); return; }
      res.status(200).json({ success: true, data: trend });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve trend', error: error.message });
    }
  };

  /** POST /api/pipeline/run */
  runPipeline = async (req: Request, res: Response): Promise<void> => {
    try {
      const { hashtags, maxPosts, minViews } = req.body || {};
      console.log('[TrendsController] Manual pipeline run requested');
      const summary = await this.pipeline.run({
        hashtags,
        maxPosts: maxPosts ? parseInt(maxPosts, 10) : 10,
        minViews: minViews ? parseInt(minViews, 10) : 10000,
      });
      res.status(200).json({ success: true, message: 'Pipeline finished successfully', summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Pipeline execution failed', error: error.message });
    }
  };

  /**
   * POST /api/trends/seed
   * Seeds 8 realistic demo trends so the UI works without running the full AI pipeline.
   */
  seedDemoData = async (_req: Request, res: Response): Promise<void> => {
    const DEMO_TRENDS = [
      {
        post_id: 'demo-tt-001', platform: 'tiktok',
        trend_title: '#TikTokMadeMeBuyIt – LED Face Mask Glow-Up',
        target_category: 'Beauty & Skincare', virality_score: 94,
        views: 18700000, likes: 2340000, shares: 412000, comments: 89000, growth_rate: '+394%',
        video_url: '', audio_url: '', sound_name: 'Viral Phonk Beat 2024',
        caption: 'This LED mask cleared my skin in 2 weeks! #skincare #glowup #TikTokMadeMeBuyIt',
        hashtags: ['TikTokMadeMeBuyIt', 'skincare', 'glowup', 'beauty'],
        raw_transcript: 'Okay so I saw this LED face mask everywhere on my FYP and I finally caved. After just two weeks my skin is literally glowing. No more breakouts, no more dark spots.',
        script_hook: "I spent $89 on an LED face mask because TikTok made me — here's what happened after 14 days.",
        script_body: "Week one: literally nothing. Week two: I woke up and my skin looked like I'd been sleeping on a cloud. Red light targets inflammation, blue light kills bacteria — it's science, not magic.",
        script_cta: "Link in bio — 40% off right now. Best $89 I've ever spent. Save this for later.",
        why_it_works: 'Before/after reveal with a specific timeframe (14 days) creates a measurable promise. Self-deprecating opener disarms skepticism instantly.',
        post_timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        post_id: 'demo-tt-002', platform: 'tiktok',
        trend_title: 'Amazon Finds Under $30 – Posture Corrector',
        target_category: 'Health & Wellness', virality_score: 88,
        views: 11200000, likes: 1890000, shares: 298000, comments: 54000, growth_rate: '+271%',
        video_url: '', audio_url: '', sound_name: 'Lo-Fi Study Beats',
        caption: 'This $24 posture corrector changed my WFH life #AmazonFinds #BackPain #WorkFromHome',
        hashtags: ['AmazonFinds', 'BackPain', 'WorkFromHome', 'PostureCorrector'],
        raw_transcript: "I've been working from home 3 years and my back was DESTROYED. Found this posture corrector for $24 on Amazon — within a week I stopped getting headaches.",
        script_hook: "My chiropractor wanted $200/session. This $24 Amazon find did what 6 sessions couldn't.",
        script_body: "Simple brace that snaps around your shoulders and trains your muscles. 30 minutes/day for 3 weeks. At week 4 I barely notice I'm sitting straight anymore.",
        script_cta: "Prime eligible — you'll have it tomorrow. Linked below. Your future self will thank you.",
        why_it_works: 'Price anchoring ($200 vs $24) creates undeniable value. Specific commitment stats (30 min/day) make it feel manageable.',
        post_timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        post_id: 'demo-tt-003', platform: 'tiktok',
        trend_title: 'POV: This Portable Blender Changed My Morning',
        target_category: 'Kitchen & Home', virality_score: 82,
        views: 8900000, likes: 1200000, shares: 187000, comments: 41000, growth_rate: '+218%',
        video_url: '', audio_url: '', sound_name: 'Upbeat Morning Vibes',
        caption: 'POV: you finally have no excuse not to eat healthy #PortableBlender #HealthyEating',
        hashtags: ['PortableBlender', 'HealthyEating', 'MorningRoutine', 'ViralProducts'],
        raw_transcript: "POV: you used to skip breakfast every day. Now this $35 blender makes your protein shake in 45 seconds.",
        script_hook: "POV: the $35 gadget that ended 3 years of skipping breakfast.",
        script_body: "Frozen berries, banana, protein powder, oat milk. Cap it, press the button — 45 seconds. USB-C charging so you top it up at your desk. No more excuses.",
        script_cta: "Comes in 6 colors — grab yours before they sell out again. Link below.",
        why_it_works: 'POV format places the viewer directly in the narrative. "No excuse" framing removes the last objection before they can raise it.',
        post_timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      },
      {
        post_id: 'demo-tt-004', platform: 'tiktok',
        trend_title: 'ASMR Unboxing – Premium Smartwatch Under $100',
        target_category: 'Electronics & Audio', virality_score: 86,
        views: 9800000, likes: 1560000, shares: 231000, comments: 67000, growth_rate: '+247%',
        video_url: '', audio_url: '', sound_name: 'ASMR Unboxing Sounds',
        caption: 'ASMR unboxing the smartwatch everyone is talking about 🤫⌚ #ASMR #Smartwatch #TechTok',
        hashtags: ['ASMR', 'Smartwatch', 'Unboxing', 'TechTok', 'ViralProducts'],
        raw_transcript: 'ASMR unboxing. Listen to that satisfying magnetic clasp. Heart rate, sleep tracking, 7-day battery. All under $100.',
        script_hook: "ASMR unboxing the $89 smartwatch outselling Apple Watch on Amazon right now.",
        script_body: "Premium magnetic box, velvet tray. 1.8\" AMOLED, 7-day battery, heart rate, SpO2, sleep tracking. Health accuracy within 3% of Apple Watch Series 6.",
        script_cta: "Going in and out of stock daily. Linking the exact one I got below.",
        why_it_works: 'ASMR captures scroll-stoppers with audio hook. Benchmarking against Apple Watch positions the budget product against an aspirational alternative.',
        post_timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      },
      {
        post_id: 'demo-ig-001', platform: 'instagram',
        trend_title: '"Expectation vs Reality" – Budget Wireless Earbuds',
        target_category: 'Electronics & Audio', virality_score: 79,
        views: 6400000, likes: 980000, shares: 143000, comments: 32000, growth_rate: '+189%',
        video_url: '', audio_url: '', sound_name: 'Trending Reel Audio',
        caption: 'Expectation vs Reality with budget wireless earbuds 🎧 #TechReview #WirelessEarbuds',
        hashtags: ['TechReview', 'WirelessEarbuds', 'BudgetTech', 'ViralReels'],
        raw_transcript: "Expectation: $30 earbuds will sound terrible. Reality: I returned my $200 ones because these hit harder.",
        script_hook: "I bought $30 earbuds expecting garbage — now my $200 ones are in a drawer.",
        script_body: "Bass hits harder, ANC tested on an actual flight, 28-hour battery on one charge. Been recommending these to everyone I know.",
        script_cta: "These sell out weekly. Pinning the link — tap before Thursday.",
        why_it_works: '"Expectation vs Reality" is endlessly replayable. The contrast format is inherently satisfying. Real-world test on a flight adds hard credibility.',
        post_timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      },
      {
        post_id: 'demo-ig-002', platform: 'instagram',
        trend_title: '"Get Ready With Me" – Dewy Skin Serum Routine',
        target_category: 'Beauty & Skincare', virality_score: 77,
        views: 5700000, likes: 841000, shares: 126000, comments: 28000, growth_rate: '+174%',
        video_url: '', audio_url: '', sound_name: 'GRWM Audio Trend',
        caption: 'GRWM: my 5-min morning routine that keeps skin dewy all day ✨ #GRWM #MorningRoutine',
        hashtags: ['GRWM', 'MorningRoutine', 'SkincareTok', 'GlowUp'],
        raw_transcript: 'Get ready with me. My whole morning skincare routine takes 5 minutes. Step 1: hyaluronic acid serum on damp skin. Step 2: SPF moisturizer. Done.',
        script_hook: "My 5-minute GRWM that keeps skin dewy for 12 hours — no filter, no foundation.",
        script_body: "Cleanse, apply 2 drops hyaluronic acid to damp skin (the step people miss), seal with SPF 50 tinted moisturizer. I get asked every day what I use.",
        script_cta: "Everything linked in bio. The serum always runs low — check before it sells out.",
        why_it_works: '"Get Ready With Me" is the highest-viewed Reels format. The "no filter" claim is the ultimate trust signal — it pre-empts skepticism instantly.',
        post_timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      },
      {
        post_id: 'demo-x-001', platform: 'x',
        trend_title: '"Quiet Quitting Skincare" – 3-Step Minimalist Routine',
        target_category: 'Beauty & Skincare', virality_score: 74,
        views: 4100000, likes: 287000, shares: 98000, comments: 21000, growth_rate: '+156%',
        video_url: '', audio_url: '', sound_name: 'No Audio (Text Post)',
        caption: 'I "quiet quit" my 12-step skincare routine. My skin has never been better. 3 products replaced $400 worth. [Thread]',
        hashtags: ['Skincare', 'QuietQuitting', 'MinimalistBeauty', 'SkincareTips'],
        raw_transcript: 'Thread: quiet quit the 12-step routine. Kept 3 products. Skin cleared in 30 days. Here is what I kept and why each one stayed.',
        script_hook: "I 'quiet quit' my 12-step skincare routine and my skin cleared in 30 days.",
        script_body: "Kept: (1) gentle cleanser, (2) vitamin C serum, (3) SPF 50. Dropped toner, essence, eye cream — all of it. Less products = less inflammation. Simple chemistry.",
        script_cta: "Replying with exact products below. Bookmark this — full breakdown posting at 9am.",
        why_it_works: 'Borrowing "quiet quitting" reframes a mundane beauty topic as a rebellion narrative. Thread format creates appointment viewing.',
        post_timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
      },
      {
        post_id: 'demo-rd-001', platform: 'reddit',
        trend_title: 'r/BuyItForLife: 2-Year Review – Smart Water Bottle',
        target_category: 'Fitness & Sports', virality_score: 71,
        views: 2800000, likes: 94000, shares: 47000, comments: 18000, growth_rate: '+134%',
        video_url: '', audio_url: '', sound_name: 'No Audio (Text Post)',
        caption: '[2 Year Honest Review] This $45 smart water bottle — worth it or gimmick? Used it every single day.',
        hashtags: ['BuyItForLife', 'HonestReview', 'HydrationGoals', 'SmartHome'],
        raw_transcript: 'Two-year honest review. Used every day. Survived 4-foot concrete drop, camping at -5°C, dishwasher max heat. Hydration reminders made me drink 40% more water daily — I tracked it.',
        script_hook: "2-year honest review: This $45 smart bottle survived everything I threw at it.",
        script_body: "Survived: 4-foot drop on concrete, dishwasher on max heat, camping in -5°C. Hydration reminders = 40% more water/day (tracked). One flaw: the strap feels cheap after 18 months.",
        script_cta: "Full specs + buy link in comments. Ask me anything — I've tested this thing to destruction.",
        why_it_works: 'Honesty including specific flaws is the highest-trust signal on Reddit. Stress tests replace vague adjectives with measurable evidence.',
        post_timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
      },
    ];

    try {
      let seeded = 0;
      for (const trend of DEMO_TRENDS) {
        await this.dbService.saveTrend(trend as any);
        seeded++;
      }
      console.log(`[TrendsController] Seeded ${seeded} demo trends`);
      res.status(200).json({ success: true, message: `Seeded ${seeded} demo trends successfully`, count: seeded });
    } catch (error: any) {
      console.error('[TrendsController] seedDemoData error:', error);
      res.status(500).json({ success: false, message: 'Failed to seed demo data', error: error.message });
    }
  };

  /** GET /api/health */
  healthCheck = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString(), service: 'ShopPulse Trend Analysis Backend' });
  };
}
