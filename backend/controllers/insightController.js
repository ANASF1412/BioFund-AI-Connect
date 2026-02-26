/**
 * Insight Controller
 * Handles API requests for project insights and predictions
 */

const insightService = require('../services/insightService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Get project insights
 * GET /api/insights/project/:projectId
 */
const getProjectInsights = async (req, res) => {
    try {
        const { projectId } = req.params;

        const insights = await insightService.getProjectInsights(projectId);

        return sendSuccess(res, 200, 'Insights generated successfully', insights);
    } catch (error) {
        console.error('Error in getProjectInsights:', error);
        return sendError(res, 500, error.message);
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

        return sendSuccess(res, 200, 'Impact prediction generated', prediction);
    } catch (error) {
        console.error('Error in getImpactPrediction:', error);
        return sendError(res, 500, error.message);
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

        return sendSuccess(res, 200, 'Funding prediction generated', prediction);
    } catch (error) {
        console.error('Error in getFundingPrediction:', error);
        return sendError(res, 500, error.message);
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

        return sendSuccess(res, 200, 'Trends analysis generated', trends);
    } catch (error) {
        console.error('Error in getTrends:', error);
        return sendError(res, 500, error.message);
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

        return sendSuccess(res, 200, 'Recommendation generated', recommendation);
    } catch (error) {
        console.error('Error in getRecommendation:', error);
        return sendError(res, 500, error.message);
    }
};

module.exports = {
    getProjectInsights,
    getImpactPrediction,
    getFundingPrediction,
    getTrends,
    getRecommendation
};
