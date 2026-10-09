"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
// Validate configuration
(0, env_1.validateConfig)();
const app = (0, app_1.createApp)();
const server = app.listen(env_1.config.port, () => {
    console.log('================================================================');
    console.log(`🚀 ShopPulse Trend Analysis Backend is running!`);
    console.log(`🌐 Local URL:        http://localhost:${env_1.config.port}`);
    console.log(`📡 Trends API:       http://localhost:${env_1.config.port}/api/trends`);
    console.log(`⚡ Trigger Pipeline: POST http://localhost:${env_1.config.port}/api/pipeline/run`);
    console.log(`🔧 Environment:      ${env_1.config.nodeEnv}`);
    console.log(`🗄️ Database:         ${env_1.config.supabase.url ? 'Supabase Connected' : 'Local Memory Cache'}`);
    console.log('================================================================');
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
