import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env';
import { ParsedTrendRecord, TrendQueryParams } from '../types';

export class DatabaseService {
  private supabase: SupabaseClient | null = null;
  // Local in-memory fallback cache
  private memoryCache: Map<string, ParsedTrendRecord> = new Map();

  constructor() {
    if (config.supabase.url && config.supabase.serviceRoleKey) {
      try {
        this.supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
          auth: { persistSession: false },
        });
        console.log('[DatabaseService] Connected to Supabase client successfully');
      } catch (err: any) {
        console.warn('[DatabaseService] Failed to initialize Supabase client:', err.message);
      }
    } else {
      console.warn('[DatabaseService] Supabase credentials not found. Operating in in-memory cache mode.');
    }
  }

  /**
   * Upserts parsed trend record into the 'trends' table
   * Uses post_id as conflict target to prevent duplicate entries
   */
  async saveTrend(record: ParsedTrendRecord): Promise<ParsedTrendRecord> {
    // 1. Try saving to Supabase if client is active
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('trends')
          .upsert(
            {
              post_id: record.post_id,
              platform: record.platform || 'tiktok',
              trend_title: record.trend_title,
              target_category: record.target_category || 'General',
              virality_score: record.virality_score,
              views: record.views,
              likes: record.likes,
              shares: record.shares,
              comments: record.comments,
              growth_rate: record.growth_rate || '+150%',
              video_url: record.video_url,
              audio_url: record.audio_url,
              sound_name: record.sound_name || 'Trending Audio',
              caption: record.caption,
              hashtags: record.hashtags || [],
              raw_transcript: record.raw_transcript,
              script_hook: record.script_hook,
              script_body: record.script_body,
              script_cta: record.script_cta,
              why_it_works: record.why_it_works,
              post_timestamp: record.post_timestamp || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'post_id' }
          )
          .select()
          .single();

        if (error) {
          console.warn('[DatabaseService] Supabase upsert error, falling back to memory cache:', error.message);
        } else if (data) {
          console.log(`[DatabaseService] Successfully upserted trend in Supabase: "${record.trend_title}"`);
          this.memoryCache.set(record.post_id, data as ParsedTrendRecord);
          return data as ParsedTrendRecord;
        }
      } catch (err: any) {
        console.warn('[DatabaseService] Supabase error:', err.message);
      }
    }

    // 2. Memory cache fallback
    this.memoryCache.set(record.post_id, record);
    console.log(`[DatabaseService] Stored in local cache: "${record.trend_title}" (ID: ${record.post_id})`);
    return record;
  }

  /**
   * Retrieves trends with filtering, search, sorting, and pagination
   */
  async getTrends(params: TrendQueryParams = {}): Promise<{ data: ParsedTrendRecord[]; total: number }> {
    const {
      category,
      platform,
      search,
      minVirality = 0,
      limit = 20,
      offset = 0,
      sortBy = 'virality_score',
      sortOrder = 'desc',
    } = params;

    // 1. Try Supabase
    if (this.supabase) {
      try {
        let query = this.supabase.from('trends').select('*', { count: 'exact' });

        if (category && category !== 'all') {
          query = query.ilike('target_category', `%${category}%`);
        }
        if (platform && platform !== 'all') {
          query = query.eq('platform', platform);
        }
        if (minVirality > 0) {
          query = query.gte('virality_score', minVirality);
        }
        if (search) {
          query = query.or(`trend_title.ilike.%${search}%,script_hook.ilike.%${search}%,caption.ilike.%${search}%`);
        }

        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
        query = query.range(offset, offset + limit - 1);

        const { data, count, error } = await query;
        if (!error && data) {
          return { data: data as ParsedTrendRecord[], total: count || data.length };
        }
      } catch (err: any) {
        console.warn('[DatabaseService] Supabase fetch error, using local cache:', err.message);
      }
    }

    // 2. Memory cache query
    let items = Array.from(this.memoryCache.values());

    if (category && category !== 'all') {
      items = items.filter(i => i.target_category.toLowerCase().includes(category.toLowerCase()));
    }
    if (platform && platform !== 'all') {
      items = items.filter(i => i.platform === platform);
    }
    if (minVirality > 0) {
      items = items.filter(i => i.virality_score >= minVirality);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        i =>
          i.trend_title.toLowerCase().includes(q) ||
          i.script_hook.toLowerCase().includes(q) ||
          i.caption.toLowerCase().includes(q)
      );
    }

    // Sort
    items.sort((a, b) => {
      const fieldA = (a as any)[sortBy] || 0;
      const fieldB = (b as any)[sortBy] || 0;
      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });

    const total = items.length;
    const paginated = items.slice(offset, offset + limit);

    return { data: paginated, total };
  }

  /**
   * Retrieves single trend by post_id or UUID
   */
  async getTrendById(id: string): Promise<ParsedTrendRecord | null> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('trends')
          .select('*')
          .or(`id.eq.${id},post_id.eq.${id}`)
          .maybeSingle();

        if (!error && data) return data as ParsedTrendRecord;
      } catch (err) {
        // Fall through to memory cache
      }
    }

    return this.memoryCache.get(id) || null;
  }
}
