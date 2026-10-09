import { ApifyService } from '../services/apify.service';
import { TranscriptionService } from '../services/transcription.service';
import { AnalysisService } from '../services/analysis.service';
import { DatabaseService } from '../services/db.service';
import { PipelineRunOptions, PipelineRunSummary, ParsedTrendRecord } from '../types';

export class TrendPipeline {
  private apifyService: ApifyService;
  private transcriptionService: TranscriptionService;
  private analysisService: AnalysisService;
  private dbService: DatabaseService;

  constructor(
    apifyService?: ApifyService,
    transcriptionService?: TranscriptionService,
    analysisService?: AnalysisService,
    dbService?: DatabaseService
  ) {
    this.apifyService = apifyService || new ApifyService();
    this.transcriptionService = transcriptionService || new TranscriptionService();
    this.analysisService = analysisService || new AnalysisService();
    this.dbService = dbService || new DatabaseService();
  }

  /**
   * Executes the full automated TikTok Trend Analysis & Ad Script Generation Pipeline
   * 
   * Flow:
   * 1. Extract metadata from Apify (No video download)
   * 2. Stream audio to OpenAI Whisper API
   * 3. Compute Virality Score + GPT-4o Marketing Deconstruction
   * 4. Persist parsed records to PostgreSQL / Supabase
   */
  async run(options: PipelineRunOptions = {}): Promise<PipelineRunSummary> {
    const startedAt = new Date().toISOString();
    const targetHashtags = options.hashtags || ['TikTokMadeMeBuyIt', 'ViralProducts', 'AmazonFinds'];
    const maxPosts = options.maxPosts || 10;
    const minViews = options.minViews || 50000;

    const summary: PipelineRunSummary = {
      startedAt,
      completedAt: '',
      hashtagsScraped: targetHashtags,
      rawPostsFetched: 0,
      postsTranscribed: 0,
      trendsAnalyzed: 0,
      recordsSaved: 0,
      errorsCount: 0,
      errors: [],
    };

    console.log('================================================================');
    console.log(`🚀 [PIPELINE START] Scraping & analyzing TikTok trends`);
    console.log(`🎯 Target Hashtags: ${targetHashtags.join(', ')}`);
    console.log(`🔢 Max Posts: ${maxPosts} | Min Views Filter: ${minViews.toLocaleString()}`);
    console.log('================================================================');

    try {
      // -------------------------------------------------------------
      // STEP 1: TREND DATA EXTRACTION (Apify Integration)
      // -------------------------------------------------------------
      console.log('\n--- [STEP 1/4] Extracting TikTok Post Metadata via Apify ---');
      const rawPosts = await this.apifyService.fetchTrendingPosts(targetHashtags, maxPosts);
      summary.rawPostsFetched = rawPosts.length;

      // Filter by minimum view count for real virality
      const filteredPosts = rawPosts.filter(p => p.playCount >= minViews);
      console.log(`[Step 1 Complete] Fetched ${rawPosts.length} posts. ${filteredPosts.length} meet the ${minViews.toLocaleString()} view threshold.`);

      const postsToProcess = filteredPosts.length > 0 ? filteredPosts : rawPosts.slice(0, maxPosts);

      // -------------------------------------------------------------
      // STEPS 2, 3, 4: Process posts sequentially or bounded batches
      // -------------------------------------------------------------
      for (let i = 0; i < postsToProcess.length; i++) {
        const post = postsToProcess[i];
        const progressTag = `[Post ${i + 1}/${postsToProcess.length}] (ID: ${post.postId})`;
        console.log(`\n>>> Processing ${progressTag}`);

        try {
          // STEP 2: Audio Transcription (Whisper API)
          console.log(`${progressTag} --- [STEP 2/4] Transcribing audio with Whisper ---`);
          const transcriptionResult = await this.transcriptionService.transcribePost(post);
          summary.postsTranscribed++;

          // STEP 3: Trend & Hook Analysis (GPT-4o Engine)
          console.log(`${progressTag} --- [STEP 3/4] Deconstructing hooks with GPT-4o ---`);
          const analysis = await this.analysisService.analyzeTrend(post, transcriptionResult.text);
          summary.trendsAnalyzed++;

          // Assemble database record
          const record: ParsedTrendRecord = {
            post_id: post.postId,
            platform: 'tiktok',
            trend_title: analysis.trendTitle,
            target_category: analysis.targetCategory,
            virality_score: analysis.viralityScore,
            views: post.playCount,
            likes: post.likeCount,
            shares: post.shareCount,
            comments: post.commentCount,
            growth_rate: `+${Math.round(analysis.viralityScore * 4.2)}%`,
            video_url: post.videoUrl,
            audio_url: post.audioUrl,
            sound_name: analysis.soundName || 'Trending Sound',
            caption: post.caption,
            hashtags: post.hashtags,
            raw_transcript: transcriptionResult.text,
            script_hook: analysis.scriptHook,
            script_body: analysis.scriptBody,
            script_cta: analysis.scriptCta,
            why_it_works: analysis.whyItWorks,
            post_timestamp: post.createTime ? new Date(post.createTime).toISOString() : new Date().toISOString(),
          };

          // STEP 4: Output & Caching (PostgreSQL / Supabase)
          console.log(`${progressTag} --- [STEP 4/4] Caching into Supabase / PostgreSQL ---`);
          await this.dbService.saveTrend(record);
          summary.recordsSaved++;

          console.log(`✅ ${progressTag} Successfully processed: "${analysis.trendTitle}" (${analysis.viralityScore}/100)`);
        } catch (itemError: any) {
          summary.errorsCount++;
          summary.errors.push({
            postId: post.postId,
            step: 'Item Processing',
            message: itemError.message,
          });
          console.error(`❌ ${progressTag} Failed to process:`, itemError.message);
          // Continue to next item without breaking the whole pipeline
        }
      }

    } catch (pipelineError: any) {
      summary.errorsCount++;
      summary.errors.push({
        step: 'Pipeline Execution',
        message: pipelineError.message,
      });
      console.error('💥 [PIPELINE CRITICAL ERROR]:', pipelineError.message);
    }

    summary.completedAt = new Date().toISOString();
    console.log('\n================================================================');
    console.log(`🏁 [PIPELINE COMPLETE]`);
    console.log(`📊 Summary: Fetched ${summary.rawPostsFetched} | Transcribed ${summary.postsTranscribed} | Analyzed ${summary.trendsAnalyzed} | Saved ${summary.recordsSaved} | Errors ${summary.errorsCount}`);
    console.log('================================================================\n');

    return summary;
  }
}
