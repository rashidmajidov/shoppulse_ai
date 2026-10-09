"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptionService = void 0;
const openai_1 = __importStar(require("openai"));
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
class TranscriptionService {
    openai;
    constructor() {
        this.openai = new openai_1.default({
            apiKey: env_1.config.openai.apiKey,
        });
    }
    /**
     * Transcribes audio using OpenAI Whisper API without heavy video decoding
     * Prioritizes direct audio stream URL; falls back to streaming video file directly to Whisper
     */
    async transcribePost(post) {
        if (env_1.config.mockExternalApis) {
            console.log(`[TranscriptionService] Mock mode: generating transcript for post ${post.postId}`);
            return {
                text: `Stop scrolling if you need to fix your daily productivity! I was skeptical at first, but after testing this for a week, my routine has completely changed. The battery lasts forever and the display is crystal clear. Link in bio if you want to get 40% off before it sells out!`,
                language: 'en',
                duration: 15,
            };
        }
        if (!env_1.config.openai.apiKey) {
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
            const response = await axios_1.default.get(mediaUrl, {
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
            const file = await (0, openai_1.toFile)(buffer, filename, { type: mimeType });
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
        }
        catch (error) {
            console.warn(`[TranscriptionService] Whisper transcription failed for post ${post.postId} (${error.message}). ` +
                `Falling back to post caption.`);
            // Fallback to post caption so pipeline doesn't break
            return {
                text: post.caption || 'Viral trending product demonstration and review.',
                duration: 15,
            };
        }
    }
}
exports.TranscriptionService = TranscriptionService;
