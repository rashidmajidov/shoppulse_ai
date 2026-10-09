import OpenAI, { toFile } from 'openai';
import axios from 'axios';
import { config } from '../config/env';
import { TikTokRawPost, WhisperTranscriptResult } from '../types';

export class TranscriptionService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  /**
   * Transcribes audio using OpenAI Whisper API without heavy video decoding
   * Prioritizes direct audio stream URL; falls back to streaming video file directly to Whisper
   */
  async transcribePost(post: TikTokRawPost): Promise<WhisperTranscriptResult> {
    if (config.mockExternalApis) {
      console.log(`[TranscriptionService] Mock mode: generating transcript for post ${post.postId}`);
      return {
        text: `Stop scrolling if you need to fix your daily productivity! I was skeptical at first, but after testing this for a week, my routine has completely changed. The battery lasts forever and the display is crystal clear. Link in bio if you want to get 40% off before it sells out!`,
        language: 'en',
        duration: 15,
      };
    }

    if (!config.openai.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Determine stream target URL (audio preferred over full video)
    const mediaUrl = post.audioUrl || post.videoUrl;
    if (!mediaUrl) {
      console.warn(`[TranscriptionService] Post ${post.postId} has no audio or video URL. Using caption fallback.`);
      return { text: post.caption, duration: 15 };
    }

    console.log(`[TranscriptionService] Streaming audio from ${post.audioUrl ? 'audio URL' : 'video URL'} for post ${post.postId}...`);

    try {
      // Stream buffer directly via HTTP GET without saving huge video files on disk
      const response = await axios.get(mediaUrl, {
        responseType: 'arraybuffer',
        timeout: 25000,
        maxContentLength: 25 * 1024 * 1024, // 25MB Whisper API limit
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.tiktok.com/',
        },
      });

      const buffer = Buffer.from(response.data);
      const filename = post.audioUrl ? `audio_${post.postId}.mp3` : `clip_${post.postId}.mp4`;
      const mimeType = post.audioUrl ? 'audio/mpeg' : 'video/mp4';

      // Convert buffer to OpenAI file format
      const file = await toFile(buffer, filename, { type: mimeType });

      console.log(`[TranscriptionService] Sending ${Math.round(buffer.length / 1024)} KB payload to OpenAI Whisper API...`);

      // Call OpenAI Whisper API
      const transcription = await this.openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        prompt: 'TikTok viral review product advertisement hook problem solution CTA',
        response_format: 'verbose_json',
      });

      const transcriptText = (transcription.text || '').trim();
      console.log(`[TranscriptionService] Whisper transcription complete (${transcriptText.length} chars)`);

      return {
        text: transcriptText || post.caption,
        language: transcription.language,
        duration: transcription.duration,
      };
    } catch (error: any) {
      console.warn(
        `[TranscriptionService] Whisper transcription failed for post ${post.postId} (${error.message}). ` +
        `Falling back to post caption.`
      );
      // Fallback to post caption so pipeline doesn't break
      return {
        text: post.caption || 'Viral trending product demonstration and review.',
        duration: 15,
      };
    }
  }
}
