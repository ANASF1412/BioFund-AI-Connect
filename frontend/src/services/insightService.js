/**
 * Insight Service (Frontend)
 * API wrapper for project insights and predictions
 */

import api from './api';

const insightService = {
    /**
     * Get comprehensive insights for a project
     */
    getProjectInsights: async (projectId) => {
        try {
            const response = await api.get(`/insights/project/${projectId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get impact prediction only
     */
    getImpactPrediction: async (projectId) => {
        try {
            const response = await api.get(`/insights/impact/${projectId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get funding prediction only
     */
    getFundingPrediction: async (projectId) => {
        try {
            const response = await api.get(`/insights/funding/${projectId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get trend analysis
     */
    getImpactTrends: async (projectId) => {
        try {
            const response = await api.get(`/insights/trends/${projectId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get AI recommendation
     */
    getRecommendation: async (projectId) => {
        try {
            const response = await api.get(`/insights/recommendation/${projectId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default insightService;
