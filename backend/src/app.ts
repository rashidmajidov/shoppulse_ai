import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { trendsRouter } from './routes/trends.routes';

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*', // Allow frontend requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api', trendsRouter);

  // Root status
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'ShopPulse AI Trend Analysis Pipeline API',
      version: '1.0.0',
      status: 'active',
      endpoints: {
        trends: 'GET /api/trends',
        runPipeline: 'POST /api/pipeline/run',
        health: 'GET /api/health',
      },
    });
  });

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[App Error Handler]', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });

  return app;
}
