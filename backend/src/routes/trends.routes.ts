import { Router } from 'express';
import { TrendsController } from '../controllers/trends.controller';

export const trendsRouter = Router();
const controller = new TrendsController();

// Query cached trends
trendsRouter.get('/trends', controller.getTrends);

// Seed demo data (must come before /:id to avoid route conflict)
trendsRouter.post('/trends/seed', controller.seedDemoData);

// Fetch single trend details
trendsRouter.get('/trends/:id', controller.getTrendById);

// Trigger on-demand pipeline execution
trendsRouter.post('/pipeline/run', controller.runPipeline);

// Service Health check
trendsRouter.get('/health', controller.healthCheck);
