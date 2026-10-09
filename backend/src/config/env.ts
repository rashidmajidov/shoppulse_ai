import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface AppConfig {
  port: number;
  nodeEnv: string;
  apify: {
    apiToken: string;
    actorId: string;
  };
  openai: {
    apiKey: string;
  };
  supabase: {
    url: string;
    serviceRoleKey: string;
  };
  databaseUrl?: string;
  mockExternalApis: boolean;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apify: {
    apiToken: process.env.APIFY_API_TOKEN || '',
    actorId: process.env.APIFY_ACTOR_ID || 'clockworks/free-tiktok-scraper',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  databaseUrl: process.env.DATABASE_URL,
  mockExternalApis: process.env.MOCK_EXTERNAL_APIS === 'true',
};

// Validate critical keys when not running in mock mode
export function validateConfig(): void {
  const missingKeys: string[] = [];

  if (!config.mockExternalApis) {
    if (!config.apify.apiToken) missingKeys.push('APIFY_API_TOKEN');
    if (!config.openai.apiKey) missingKeys.push('OPENAI_API_KEY');
    if (!config.supabase.url && !config.databaseUrl) missingKeys.push('SUPABASE_URL / DATABASE_URL');
  }

  if (missingKeys.length > 0) {
    console.warn(
      `[CONFIG WARNING] Missing configuration keys: ${missingKeys.join(', ')}. ` +
      `Pipeline will fail or require MOCK_EXTERNAL_APIS=true.`
    );
  }
}
