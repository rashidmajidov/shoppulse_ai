"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.validateConfig = validateConfig;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from backend root
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.config = {
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
function validateConfig() {
    const missingKeys = [];
    if (!exports.config.mockExternalApis) {
        if (!exports.config.apify.apiToken)
            missingKeys.push('APIFY_API_TOKEN');
        if (!exports.config.openai.apiKey)
            missingKeys.push('OPENAI_API_KEY');
        if (!exports.config.supabase.url && !exports.config.databaseUrl)
            missingKeys.push('SUPABASE_URL / DATABASE_URL');
    }
    if (missingKeys.length > 0) {
        console.warn(`[CONFIG WARNING] Missing configuration keys: ${missingKeys.join(', ')}. ` +
            `Pipeline will fail or require MOCK_EXTERNAL_APIS=true.`);
    }
}
