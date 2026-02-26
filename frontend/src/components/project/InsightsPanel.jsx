import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, AlertCircle, Loader as LoaderIcon } from 'lucide-react';
import insightService from '../../services/insightService';

const InsightsPanel = ({ projectId }) => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInsights();
    }, [projectId]);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await insightService.getProjectInsights(projectId);
            setInsights(data.data);
        } catch (err) {
            console.error('Error fetching insights:', err);
            setError('Failed to load insights');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-dark-800 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-800 p-8"
            >
                <div className="flex items-center justify-center gap-3 py-12">
                    <LoaderIcon size={24} className="text-primary-500 animate-spin" />
                    <p className="text-slate-600 dark:text-slate-400 font-semibold">Loading insights...</p>
                </div>
            </motion.div>
        );
    }

    if (error || !insights) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-dark-800 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-800 p-8"
            >
                <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Insights Unavailable</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{error || 'Unable to generate insights at this time'}</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    const {
        recommendation,
        impactPrediction,
        fundingPrediction,
        trends
    } = insights;

    const getRiskColor = (level) => {
        switch (level) {
            case 'Low':
                return { bg: 'bg-emerald-100 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800/50' };
            case 'Moderate':
                return { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/50' };
            default:
                return { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800/50' };
        }
    };

    const riskColor = getRiskColor(recommendation.riskLevel);

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <Zap size={28} className="text-primary-600 dark:text-primary-400" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">AI Impact Insights</h2>
            </div>

            {/* AI Recommendation */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`${riskColor.bg} ${riskColor.border} border-2 rounded-3xl p-8`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <p className={`text-sm font-bold uppercase tracking-wide ${riskColor.text} mb-2`}>
                            AI Recommendation
                        </p>
                        <p className="text-slate-900 dark:text-white text-lg leading-relaxed font-semibold">
                            {recommendation.text}
                        </p>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-current border-opacity-20">
                            <div>
                                <p className={`text-xs uppercase tracking-widest ${riskColor.text} font-bold`}>Risk Level</p>
                                <p className={`text-lg font-black ${riskColor.text}`}>{recommendation.riskLevel}</p>
                            </div>
                            <div>
                                <p className={`text-xs uppercase tracking-widest ${riskColor.text} font-bold`}>Confidence</p>
                                <div className="flex items-center gap-2">
                                    <p className={`text-lg font-black ${riskColor.text}`}>{recommendation.confidence}%</p>
                                    <div className="w-24 h-2 bg-current bg-opacity-20 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${recommendation.confidence}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full rounded-full bg-current bg-opacity-80"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <TrendingUp size={40} className={`${riskColor.text} opacity-20 flex-shrink-0`} />
                </div>
            </motion.div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Projected Trees */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white dark:bg-dark-800 rounded-2xl border border-slate-100 dark:border-dark-800 p-6 shadow-sm"
                >
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Projected Trees (30 Days)</p>
                    <div className="mb-4">
                        <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                            {impactPrediction.predicted.trees.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                +{impactPrediction.projection.trees.toLocaleString()}
                            </span>
                            {' '}from now
                        </p>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${Math.min(
                                    (impactPrediction.predicted.trees / Math.max(impactPrediction.predicted.trees * 1.2, 1000)) * 100,
                                    100
                                )}%`
                            }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full bg-emerald-500"
                        />
                    </div>
                </motion.div>

                {/* Projected Funding */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-dark-800 rounded-2xl border border-slate-100 dark:border-dark-800 p-6 shadow-sm"
                >
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Projected Funding (30 Days)</p>
                    <div className="mb-4">
                        <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                            ${(fundingPrediction.predicted.amount / 1000).toFixed(0)}k
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                +${fundingPrediction.projection.amount.toLocaleString()}
                            </span>
                            {' '}expected
                        </p>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${Math.min(fundingPrediction.predicted.progress || 0, 100)}%`
                            }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full bg-blue-500"
                        />
                    </div>
                </motion.div>

                {/* Growth Rate */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white dark:bg-dark-800 rounded-2xl border border-slate-100 dark:border-dark-800 p-6 shadow-sm"
                >
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Activity Trend</p>
                    <div className="mb-4">
                        <p className="text-3xl font-black text-primary-600 dark:text-primary-400 capitalize">
                            {trends.updateActivity.trend}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            <span className="font-bold text-primary-600 dark:text-primary-400">
                                {trends.updateActivity.perMonth.toFixed(1)}
                            </span>
                            {' '}updates/month
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-400">Consistency:</span>
                            <span className="font-bold text-slate-900 dark:text-white">{trends.timelineAnalysis.consistency}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-400">Recent Activity:</span>
                            <span className="font-bold text-slate-900 dark:text-white">{trends.timelineAnalysis.recentActivityScore}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Growth Rate Daily */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-50 dark:bg-dark-900 rounded-2xl p-4"
                >
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Trees/Day</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {parseFloat(impactPrediction.growthRates.treesPerDay).toFixed(1)}
                    </p>
                </motion.div>

                {/* Days to Completion */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="bg-slate-50 dark:bg-dark-900 rounded-2xl p-4"
                >
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Days to Complete</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {fundingPrediction.estimatedCompletion.daysRemaining > 365 ? '1yr+' : fundingPrediction.estimatedCompletion.daysRemaining}
                    </p>
                </motion.div>

                {/* Funding Growth Rate */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-50 dark:bg-dark-900 rounded-2xl p-4"
                >
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Monthly Growth</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                        ${(parseFloat(fundingPrediction.growthRates.perMonth) / 1000).toFixed(1)}k
                    </p>
                </motion.div>

                {/* Investor Growth */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="bg-slate-50 dark:bg-dark-900 rounded-2xl p-4"
                >
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">New Investors (30d)</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                        +{fundingPrediction.projection.investors}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default InsightsPanel;
