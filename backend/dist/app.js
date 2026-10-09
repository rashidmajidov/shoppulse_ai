"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const trends_routes_1 = require("./routes/trends.routes");
function createApp() {
    const app = (0, express_1.default)();
    // Middleware
    app.use((0, cors_1.default)({
        origin: '*', // Allow frontend requests
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    // Routes
    app.use('/api', trends_routes_1.trendsRouter);
    // Root status
    app.get('/', (_req, res) => {
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
    app.use((err, _req, res, _next) => {
        console.error('[App Error Handler]', err);
        res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Internal Server Error',
        });
    });
    return app;
}
