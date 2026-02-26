/**
 * Insight Controller
 * Handles API requests for project insights and predictions
 */

const insightService = require('../services/insightService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Get project insights
 * GET /api/insights/project/:projectId
 */
const getProjectInsights = async (req, res) => {
    try {
        const { projectId } = req.params;

        const insights = await insightService.getProjectInsights(projectId);

        return successResponse(res, insights, 'Insights generated successfully', 200);
    } catch (error) {
        console.error('Error in getProjectInsights:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get impact prediction only
 * GET /api/insights/impact/:projectId
 */
const getImpactPrediction = async (req, res) => {
    try {
        const { projectId } = req.params;

        const prediction = await insightService.predictImpact(projectId);

        return successResponse(res, prediction, 'Impact prediction generated', 200);
    } catch (error) {
        console.error('Error in getImpactPrediction:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get funding prediction only
 * GET /api/insights/funding/:projectId
 */
const getFundingPrediction = async (req, res) => {
    try {
        const { projectId } = req.params;

        const prediction = await insightService.predictFunding(projectId);

        return successResponse(res, prediction, 'Funding prediction generated', 200);
    } catch (error) {
        console.error('Error in getFundingPrediction:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get impact trends
 * GET /api/insights/trends/:projectId
 */
const getTrends = async (req, res) => {
    try {
        const { projectId } = req.params;

        const trends = await insightService.getImpactTrends(projectId);

        return successResponse(res, trends, 'Trends analysis generated', 200);
    } catch (error) {
        console.error('Error in getTrends:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get AI recommendation
 * GET /api/insights/recommendation/:projectId
 */
const getRecommendation = async (req, res) => {
    try {
        const { projectId } = req.params;

        const recommendation = await insightService.generateRecommendation(projectId);

        return successResponse(res, recommendation, 'Recommendation generated', 200);
    } catch (error) {
        console.error('Error in getRecommendation:', error);
        return errorResponse(res, error.message, 500);
    }
};

module.exports = {
    getProjectInsights,
    getImpactPrediction,
    getFundingPrediction,
    getTrends,
    getRecommendation
};
