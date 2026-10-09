"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trendsRouter = void 0;
const express_1 = require("express");
const trends_controller_1 = require("../controllers/trends.controller");
exports.trendsRouter = (0, express_1.Router)();
const controller = new trends_controller_1.TrendsController();
// Query cached trends
exports.trendsRouter.get('/trends', controller.getTrends);
// Seed demo data (must come before /:id to avoid route conflict)
exports.trendsRouter.post('/trends/seed', controller.seedDemoData);
// Fetch single trend details
exports.trendsRouter.get('/trends/:id', controller.getTrendById);
// Trigger on-demand pipeline execution
exports.trendsRouter.post('/pipeline/run', controller.runPipeline);
// Service Health check
exports.trendsRouter.get('/health', controller.healthCheck);
