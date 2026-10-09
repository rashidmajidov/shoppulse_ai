/**
 * ShopPulse AI Backend Pipeline - Type Definitions
 */

export interface TikTokRawPost {
  postId: string;
  videoUrl: string;
  audioUrl?: string | null;
  caption: string;
  hashtags: string[];
  playCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  createTime?: number | string;
  authorUsername?: string;
}

export interface WhisperTranscriptResult {
  text: string;
  language?: string;
  duration?: number;
}

export interface MarketingAnalysisResult {
  trendTitle: string;
  targetCategory: string;
  viralityScore: number;
  scriptHook: string;       // 0-3s attention grabber
  scriptBody: string;       // 3-12s problem/solution angle
  scriptCta: string;        // 12-15s call to action
  whyItWorks: string;       // Psychological driver
  soundName?: string;
}

export interface ParsedTrendRecord {
  id?: string;
  post_id: string;
  platform: string;
  trend_title: string;
  target_category: string;
  virality_score: number;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  growth_rate?: string;
  video_url: string;
  audio_url?: string | null;
  sound_name?: string;
  caption: string;
  hashtags: string[];
  raw_transcript: string;
  script_hook: string;
  script_body: string;
  script_cta: string;
  why_it_works?: string;
  post_timestamp?: string;
  created_at?: string;
}

export interface PipelineRunOptions {
  hashtags?: string[];
  maxPosts?: number;
  minViews?: number;
  mockMode?: boolean;
}

export interface PipelineRunSummary {
  startedAt: string;
  completedAt: string;
  hashtagsScraped: string[];
  rawPostsFetched: number;
  postsTranscribed: number;
  trendsAnalyzed: number;
  recordsSaved: number;
  errorsCount: number;
  errors: Array<{ postId?: string; step: string; message: string }>;
}

export interface TrendQueryParams {
  category?: string;
  platform?: string;
  search?: string;
  minVirality?: number;
  limit?: number;
  offset?: number;
  sortBy?: 'virality_score' | 'views' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}
