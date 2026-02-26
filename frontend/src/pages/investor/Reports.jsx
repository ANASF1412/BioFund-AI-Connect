import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import reportService from '../../services/reportService';
import Loader from '../../components/common/Loader';
import { motion } from 'framer-motion';

const getESGColor = (label) => {
    switch (label) {
        case 'Excellent':
            return { bg: 'bg-emerald-100 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400' };
        case 'Good':
            return { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400' };
        case 'Moderate':
            return { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400' };
        case 'Fair':
            return { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400' };
        default:
            return { bg: 'bg-gray-100 dark:bg-gray-900/20', text: 'text-gray-700 dark:text-gray-400' };
    }
};

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await reportService.getMyReports();
            setReports(data.data || []);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Failed to load reports. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async (projectId, projectTitle) => {
        try {
            setDownloading(projectId);
            await reportService.downloadProjectReport(projectId);
        } catch (err) {
            console.error('Error downloading report:', err);
            alert('Failed to download report. Please try again.');
        } finally {
            setDownloading(null);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <FileText size={32} className="text-primary-600 dark:text-primary-400" />
                    ESG Reports
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Download ESG Impact Reports for your funded projects
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-4 flex items-start gap-3"
                >
                    <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </motion.div>
            )}

            {/* Reports List */}
            {reports.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700 p-12 text-center"
                >
                    <FileText size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Reports Yet</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Generate your first ESG report by funding a project and clicking the download button.
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {reports.map((report, index) => {
                        const esgColor = getESGColor(report.esgScore?.label);
                        const reportDate = new Date(report.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        });

                        return (
                            <motion.div
                                key={report._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700 p-6 hover:shadow-md dark:hover:shadow-dark-900/50 transition-shadow"
                            >
                                <div className="flex items-center justify-between gap-6">
                                    {/* Left Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-dark-700 flex items-center justify-center flex-shrink-0">
                                                <FileText size={24} className="text-slate-600 dark:text-slate-400" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-900 dark:text-white truncate">
                                                    {report.projectId?.title || 'Project Report'}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {reportDate}
                                                    </span>
                                                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                                        {report.referenceId}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ESG Score Badge */}
                                    {report.esgScore && (
                                        <div
                                            className={`flex-shrink-0 px-4 py-3 rounded-xl text-center min-w-max ${esgColor.bg}`}
                                        >
                                            <div className={`text-2xl font-black ${esgColor.text}`}>
                                                {report.esgScore.overall}
                                            </div>
                                            <div className={`text-xs font-bold uppercase tracking-wider ${esgColor.text} mt-1`}>
                                                {report.esgScore.label}
                                            </div>
                                        </div>
                                    )}

                                    {/* Download Button */}
                                    <button
                                        onClick={() => handleDownloadReport(report.projectId?._id, report.projectId?.title)}
                                        disabled={downloading === report.projectId?._id}
                                        className="flex-shrink-0 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                                    >
                                        {downloading === report.projectId?._id ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Downloading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download size={18} />
                                                Download
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* ESG Sub-scores */}
                                {report.esgScore && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-dark-700 grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                                Environmental
                                            </p>
                                            <p className="text-lg font-black text-slate-900 dark:text-white">
                                                {report.esgScore.environmental}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                                Social
                                            </p>
                                            <p className="text-lg font-black text-slate-900 dark:text-white">
                                                {report.esgScore.social}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                                                Governance
                                            </p>
                                            <p className="text-lg font-black text-slate-900 dark:text-white">
                                                {report.esgScore.governance}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Reports;
