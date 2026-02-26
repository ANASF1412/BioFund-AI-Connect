/**
 * Insight Routes
 * API endpoints for AI insights and predictions
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getProjectInsights,
    getImpactPrediction,
    getFundingPrediction,
    getTrends,
    getRecommendation
} = require('../controllers/insightController');

/**
 * All insight endpoints are public (no auth required for now)
 * But you can add authMiddleware if needed
 */

// GET /api/insights/project/:projectId - Get all insights for a project
router.get('/project/:projectId', getProjectInsights);

// GET /api/insights/impact/:projectId - Get impact prediction only
router.get('/impact/:projectId', getImpactPrediction);

// GET /api/insights/funding/:projectId - Get funding prediction only
router.get('/funding/:projectId', getFundingPrediction);

// GET /api/insights/trends/:projectId - Get trend analysis
router.get('/trends/:projectId', getTrends);

// GET /api/insights/recommendation/:projectId - Get AI recommendation
router.get('/recommendation/:projectId', getRecommendation);

module.exports = router;
