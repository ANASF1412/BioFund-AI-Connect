/**
 * Insight Service
 * Generates AI predictions and trend analysis for projects
 */

const Project = require('../models/Project');
const Funding = require('../models/Funding');

/**
 * Predict impact for next 30 days
 * Uses growth rate calculation from historical data
 */
const predictImpact = async (projectId) => {
    try {
        const project = await Project.findById(projectId);
        if (!project) throw new Error('Project not found');

        const impacts = project.impacts || {};
        const createdAt = new Date(project.createdAt);
        const now = new Date();
        const daysElapsed = Math.max(1, Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24)));

        // ===== TREES PREDICTION =====
        const treesPlanted = impacts.treesPlanted || 0;
        const treesGrowthRate = treesPlanted / daysElapsed; // Trees per day
        const predictedTrees = Math.round(treesPlanted + treesGrowthRate * 30);
        const treesGrowthProjection = Math.round(treesGrowthRate * 30);

        // ===== WATER PREDICTION =====
        const waterSaved = impacts.waterSaved || 0;
        const waterGrowthRate = waterSaved / daysElapsed; // Water per day
        const predictedWater = Math.round(waterSaved + waterGrowthRate * 30);
        const waterGrowthProjection = Math.round(waterGrowthRate * 30);

        // ===== LAND PREDICTION =====
        const landRestored = impacts.landsRestored || 0;
        const landGrowthRate = landRestored / daysElapsed;
        const predictedLand = (landRestored + landGrowthRate * 30).toFixed(2);
        const landGrowthProjection = (landGrowthRate * 30).toFixed(2);

        return {
            current: {
                trees: treesPlanted,
                water: waterSaved,
                land: landRestored
            },
            predicted: {
                trees: predictedTrees,
                water: predictedWater,
                land: parseFloat(predictedLand)
            },
            projection: {
                trees: treesGrowthProjection,
                water: waterGrowthProjection,
                land: parseFloat(landGrowthProjection)
            },
            growthRates: {
                treesPerDay: treesGrowthRate.toFixed(2),
                waterPerDay: waterGrowthRate.toFixed(2),
                landPerDay: landGrowthRate.toFixed(4)
            }
        };
    } catch (error) {
        throw new Error(`Error predicting impact: ${error.message}`);
    }
};

/**
 * Predict funding for next 30 days
 * Uses funding rate from historical data
 */
const predictFunding = async (projectId) => {
    try {
        const project = await Project.findById(projectId);
        if (!project) throw new Error('Project not found');

        const currentFunding = project.currentAmount || 0;
        const goalAmount = project.goalAmount || 100000;
        const fundingCount = project.fundingCount || 0;

        const createdAt = new Date(project.createdAt);
        const now = new Date();
        const daysElapsed = Math.max(1, Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24)));

        // ===== FUNDING TREND =====
        const fundingGrowthRate = currentFunding / daysElapsed; // $ per day
        const predictedFunding = Math.round(currentFunding + fundingGrowthRate * 30);
        const fundingProjection = Math.round(fundingGrowthRate * 30);

        // ===== INVESTOR TREND =====
        const investorGrowthRate = fundingCount / daysElapsed; // Investors per day
        const predictedInvestorCount = Math.round(fundingCount + investorGrowthRate * 30);

        // ===== FUNDING COMPLETION ESTIMATE =====
        const remainingFunding = Math.max(0, goalAmount - currentFunding);
        let daysToCompletion = remainingFunding > 0 ? Math.ceil(remainingFunding / Math.max(1, fundingGrowthRate)) : 0;
        daysToCompletion = Math.min(daysToCompletion, 365); // Cap at 1 year

        // ===== PROGRESS METRICS =====
        const currentProgress = (currentFunding / goalAmount) * 100;
        const predictedProgress = (predictedFunding / goalAmount) * 100;

        return {
            current: {
                amount: currentFunding,
                investors: fundingCount,
                progress: currentProgress.toFixed(2)
            },
            predicted: {
                amount: predictedFunding,
                investors: predictedInvestorCount,
                progress: Math.min(predictedProgress.toFixed(2), 100)
            },
            projection: {
                amount: fundingProjection,
                investors: Math.round(investorGrowthRate * 30)
            },
            growthRates: {
                perDay: fundingGrowthRate.toFixed(2),
                perWeek: (fundingGrowthRate * 7).toFixed(2),
                perMonth: (fundingGrowthRate * 30).toFixed(2)
            },
            estimatedCompletion: {
                daysRemaining: daysToCompletion,
                estimatedDate: new Date(now.getTime() + daysToCompletion * 24 * 60 * 60 * 1000)
            }
        };
    } catch (error) {
        throw new Error(`Error predicting funding: ${error.message}`);
    }
};

/**
 * Analyze project trends from updates timeline
 */
const getImpactTrends = async (projectId) => {
    try {
        const project = await Project.findById(projectId);
        if (!project) throw new Error('Project not found');

        const updates = project.updates || [];
        const createdAt = new Date(project.createdAt);
        const now = new Date();
        const totalDaysElapsed = Math.max(1, Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24)));

        // ===== ACTIVITY METRICS =====
        const updateCount = updates.length;
        const updatesPerWeek = (updateCount / (totalDaysElapsed / 7)).toFixed(2);
        const updatesPerMonth = (updateCount / (totalDaysElapsed / 30)).toFixed(2);

        // ===== RECENT VS EARLY ACTIVITY =====
        const midpointDate = new Date(createdAt.getTime() + (totalDaysElapsed / 2) * 24 * 60 * 60 * 1000);
        const recentUpdates = updates.filter(u => new Date(u.createdAt || u.message) > midpointDate).length;
        const earlyUpdates = updateCount - recentUpdates;

        const activityTrend = recentUpdates > earlyUpdates ? 'accelerating' : recentUpdates === earlyUpdates ? 'stable' : 'decelerating';

        // ===== GROWTH ANALYSIS =====
        const impacts = project.impacts || {};
        const treesPlanted = impacts.treesPlanted || 0;
        const treesPerUpdate = updateCount > 0 ? (treesPlanted / updateCount).toFixed(2) : 0;

        // ===== ENGAGEMENT RATE =====
        const fundingCount = project.fundingCount || 0;
        const investorsPerUpdate = updateCount > 0 ? (fundingCount / updateCount).toFixed(2) : 0;

        return {
            updateActivity: {
                total: updateCount,
                perWeek: parseFloat(updatesPerWeek),
                perMonth: parseFloat(updatesPerMonth),
                trend: activityTrend
            },
            impactPerUpdate: {
                treesPerUpdate: parseFloat(treesPerUpdate),
                investorsPerUpdate: parseFloat(investorsPerUpdate)
            },
            timelineAnalysis: {
                projectAge: totalDaysElapsed,
                recentActivityScore: ((recentUpdates / Math.max(1, updateCount)) * 100).toFixed(2) + '%',
                consistency: activityTrend === 'stable' ? 'High' : activityTrend === 'accelerating' ? 'Growing' : 'Declining'
            }
        };
    } catch (error) {
        throw new Error(`Error analyzing trends: ${error.message}`);
    }
};

/**
 * Generate AI recommendation text based on insights
 */
const generateRecommendation = async (projectId) => {
    try {
        const project = await Project.findById(projectId);
        if (!project) throw new Error('Project not found');

        const impactPrediction = await predictImpact(projectId);
        const fundingPrediction = await predictFunding(projectId);
        const trends = await getImpactTrends(projectId);

        let recommendation = '';
        let riskLevel = 'Moderate';
        let confidence = 75;

        // ===== FUNDING ANALYSIS =====
        const fundingGrowthRate = parseFloat(fundingPrediction.growthRates.perDay);
        const progressPercentage = parseFloat(fundingPrediction.current.progress);
        const daysRemaining = fundingPrediction.estimatedCompletion.daysRemaining;

        // ===== IMPACT ANALYSIS =====
        const treeGrowthRate = parseFloat(impactPrediction.growthRates.treesPerDay);
        const activityTrend = trends.updateActivity.trend;
        const updatesPerMonth = parseFloat(trends.updateActivity.perMonth);

        // ===== GENERATE TEXT RECOMMENDATION =====
        if (fundingGrowthRate > 500 && treeGrowthRate > 10) {
            recommendation = 'This project is growing rapidly with strong impact momentum. Excellent growth trajectory across funding and environmental metrics. High confidence in reaching goals.';
            riskLevel = 'Low';
            confidence = 90;
        } else if (fundingGrowthRate > 200 && treeGrowthRate > 5) {
            recommendation = 'Project shows steady progress with consistent funding and impact growth. Good engagement from community. Positive outlook for project success.';
            riskLevel = 'Low';
            confidence = 80;
        } else if (fundingGrowthRate > 50 && treeGrowthRate > 0) {
            recommendation = 'Moderate growth expected. Project is progressing but at slower pace. Regular updates help maintain community engagement.';
            riskLevel = 'Moderate';
            confidence = 70;
        } else if (progressPercentage < 30 && updatesPerMonth < 1) {
            recommendation = 'Project needs more community engagement. Consider increasing update frequency and investor outreach to accelerate growth.';
            riskLevel = 'High';
            confidence = 65;
        } else if (progressPercentage > 80) {
            recommendation = 'Project is nearly fully funded! Strong community support demonstrated. Excellent time for final push to reach goal.';
            riskLevel = 'Low';
            confidence = 85;
        } else if (activityTrend === 'accelerating') {
            recommendation = 'Project momentum is accelerating. Recent updates show increased activity. Great timing to invest if interested.';
            riskLevel = 'Low';
            confidence = 80;
        } else {
            recommendation = 'Project is steady with ongoing progress. Reliable team managing the initiative with consistent updates.';
            riskLevel = 'Moderate';
            confidence = 75;
        }

        return {
            text: recommendation,
            riskLevel,
            confidence
        };
    } catch (error) {
        throw new Error(`Error generating recommendation: ${error.message}`);
    }
};

/**
 * Get comprehensive insights for a project
 */
const getProjectInsights = async (projectId) => {
    try {
        const impactPrediction = await predictImpact(projectId);
        const fundingPrediction = await predictFunding(projectId);
        const trends = await getImpactTrends(projectId);
        const recommendation = await generateRecommendation(projectId);

        return {
            impactPrediction,
            fundingPrediction,
            trends,
            recommendation,
            generatedAt: new Date()
        };
    } catch (error) {
        throw new Error(`Error generating insights: ${error.message}`);
    }
};

module.exports = {
    predictImpact,
    predictFunding,
    getImpactTrends,
    generateRecommendation,
    getProjectInsights
};
