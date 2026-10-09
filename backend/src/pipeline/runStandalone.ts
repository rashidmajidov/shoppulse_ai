import { TrendPipeline } from './trendPipeline';
import { validateConfig } from '../config/env';

async function main() {
  validateConfig();

  const pipeline = new TrendPipeline();

  const hashtags = process.argv.slice(2);
  const targetHashtags = hashtags.length > 0 
    ? hashtags 
    : ['TikTokMadeMeBuyIt', 'ViralProducts', 'AmazonFinds'];

  console.log(`Starting standalone trend analysis pipeline for: ${targetHashtags.join(', ')}`);

  const summary = await pipeline.run({
    hashtags: targetHashtags,
    maxPosts: 5,
    minViews: 20000,
  });

  console.log('Finished standalone execution summary:', JSON.stringify(summary, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal pipeline error:', err);
  process.exit(1);
});
