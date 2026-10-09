import { createApp } from './app';
import { config, validateConfig } from './config/env';

// Validate configuration
validateConfig();

const app = createApp();

const server = app.listen(config.port, () => {
  console.log('================================================================');
  console.log(`🚀 ShopPulse Trend Analysis Backend is running!`);
  console.log(`🌐 Local URL:        http://localhost:${config.port}`);
  console.log(`📡 Trends API:       http://localhost:${config.port}/api/trends`);
  console.log(`⚡ Trigger Pipeline: POST http://localhost:${config.port}/api/pipeline/run`);
  console.log(`🔧 Environment:      ${config.nodeEnv}`);
  console.log(`🗄️ Database:         ${config.supabase.url ? 'Supabase Connected' : 'Local Memory Cache'}`);
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
