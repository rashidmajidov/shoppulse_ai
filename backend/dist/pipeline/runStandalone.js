"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trendPipeline_1 = require("./trendPipeline");
const env_1 = require("../config/env");
async function main() {
    (0, env_1.validateConfig)();
    const pipeline = new trendPipeline_1.TrendPipeline();
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
