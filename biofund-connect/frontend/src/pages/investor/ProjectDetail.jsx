import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projectService from '../../services/projectService';
import fundingService from '../../services/fundingService';
import reportService from '../../services/reportService';
import Loader from '../../components/common/Loader';
import FundingModal from '../../components/common/FundingModal';
import InsightsPanel from '../../components/project/InsightsPanel';
import { motion } from 'framer-motion';
import {
    MapPin, TrendingUp, Users, Target, AlertCircle,
    TreePine, Droplets, Leaf, Globe, ArrowLeft, Share2, Heart, Download, Loader as LoaderIcon
} from 'lucide-react';

const getRiskBadge = (riskScore) => {
    if (riskScore <= 3) return { label: 'Low Risk', color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400', bgLight: 'bg-emerald-50' };
    if (riskScore <= 6) return { label: 'Medium Risk', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400', bgLight: 'bg-amber-50' };
    return { label: 'High Risk', color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400', bgLight: 'bg-red-50' };
};

const getImpactIcon = (type) => {
    switch (type) {
        case 'Forest': return <TreePine size={20} />;
        case 'Water': return <Droplets size={20} />;
        case 'Agriculture': return <Leaf size={20} />;
        default: return <Globe size={20} />;
    }
};

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [fundings, setFundings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fundingModal, setFundingModal] = useState(false);
    const [liked, setLiked] = useState(false);
    const [projectDetail, setProjectDetail] = useState(null);
    const [downloadingReport, setDownloadingReport] = useState(false);
    const [reportError, setReportError] = useState(null);
    const [esgScore, setESGScore] = useState(null);
    const [loadingESG, setLoadingESG] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [projRes, fundRes] = await Promise.all([
                    projectService.getProjectById(id),
                    fundingService.getProjectFundings(id)
                ]);
                setProject(projRes.data);
                setFundings(fundRes.data || []);

                // Fetch ESG score preview
                try {
                    setLoadingESG(true);
                    const esgRes = await reportService.getESGScorePreview(id);
                    setESGScore(esgRes.data?.esgScore);
                } catch (esgError) {
                    console.error('Error fetching ESG preview:', esgError);
                    // Don't fail the page load if ESG fails
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
                setLoadingESG(false);
            }
        };
        fetchData();
    }, [id]);

    const handleFundingSuccess = async () => {
        try {
            const [projRes, fundRes] = await Promise.all([
                projectService.getProjectById(id),
                fundingService.getProjectFundings(id)
            ]);
            setProject(projRes.data);
            setFundings(fundRes.data || []);
        } catch (error) {
            console.error('Error refreshing project data:', error);
        }
    };

    const handleDownloadReport = async () => {
        try {
            setDownloadingReport(true);
            setReportError(null);
            await reportService.downloadProjectReport(id);
        } catch (error) {
            console.error('Error downloading report:', error);
            if (error.response?.status === 403) {
                setReportError('You must have funded this project to download the ESG report.');
            } else {
                setReportError('Failed to download report. Please try again.');
            }
        } finally {
            setDownloadingReport(false);
        }
    };

    if (loading) return <Loader />;

    if (!project) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-600 dark:text-slate-400 mb-4">Project not found</p>
                <button
                    onClick={() => navigate('/investor/explore')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Projects
                </button>
            </div>
        );
    }

    const progress = Math.min((project.currentAmount / project.goalAmount) * 100, 100);
    const riskBadge = getRiskBadge(project.riskScore || 0);
    const remaining = Math.max(0, project.goalAmount - project.currentAmount);
    const avgFunding = fundings.length > 0 ? (project.currentAmount / fundings.length).toFixed(2) : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Button */}
            <button
                onClick={() => navigate('/investor/explore')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-lg font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors"
            >
                <ArrowLeft size={18} /> Back to Projects
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Hero Image */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative h-96 bg-slate-100 dark:bg-dark-900 rounded-3xl overflow-hidden group shadow-lg"
                    >
                        <img
                            src={`https://source.unsplash.com/1200x500/?${project.category || 'nature'},conservation,${project._id}`}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200&h=500';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent"></div>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-center gap-2 flex-wrap">
                            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm border border-white/20 flex items-center gap-1">
                                {getImpactIcon(project.impactType || project.category)}
                                {project.impactType || project.category || 'Forest'}
                            </div>
                            <div className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${riskBadge.color}`}>
                                {riskBadge.label}
                            </div>
                        </div>

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h1 className="text-4xl font-black text-white drop-shadow-lg mb-2">{project.title}</h1>
                            <div className="flex items-center gap-2 text-white/90 drop-shadow-md">
                                <MapPin size={18} />
                                <span className="font-semibold">
                                    {project.location?.name || `${project.location?.latitude?.toFixed(2)}, ${project.location?.longitude?.toFixed(2)}`}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-dark-800 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-800 p-8"
                    >
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">About This Project</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{project.description}</p>
                    </motion.div>

                    {/* Impact Metrics */}
                    {project.impacts && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-dark-800 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-800 p-8"
                        >
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Impact Metrics</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/50">
                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-2">Trees Planted</p>
                                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-300">
                                        {project.impacts.treesPlanted?.toLocaleString() || 0}
                                    </p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800/50">
                                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2">Water Saved</p>
                                    <p className="text-3xl font-black text-blue-600 dark:text-blue-300">
                                        {project.impacts.waterSaved?.toLocaleString() || 0}gal
                                    </p>
                                </div>
                                <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800/50">
                                    <p className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2">Wildlife Saved</p>
                                    <p className="text-3xl font-black text-amber-600 dark:text-amber-300">
                                        {project.impacts.wildlifeSaved?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* NGO Info */}
                    {project.createdBy && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-dark-800 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-800 p-8"
                        >
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Organization</h2>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-emerald-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                    {project.createdBy.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{project.createdBy.name}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{project.createdBy.email}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* AI Impact Insights */}
                    <InsightsPanel projectId={id} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Funding Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-dark-800 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-800 p-8 sticky top-8"
                    >
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Funding Goal</span>
                                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{progress.toFixed(0)}%</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                                ${project.currentAmount.toLocaleString()}
                                <span className="text-lg text-slate-500 dark:text-slate-400 font-semibold"> / ${project.goalAmount.toLocaleString()}</span>
                            </h3>
                            <div className="w-full bg-slate-200 dark:bg-dark-700 rounded-full h-3 mb-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-primary-500'}`}
                                />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Remaining: <strong>${remaining.toLocaleString()}</strong>
                            </p>
                        </div>

                        {/* Funding Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-slate-100 dark:border-dark-700">
                            <div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Investors</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                    <Users size={20} className="text-primary-500" />
                                    {project.fundingCount || 0}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Avg. Funding</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">${parseFloat(avgFunding).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setFundingModal(true)}
                                className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary-600/30"
                            >
                                <TrendingUp size={18} className="inline mr-2" /> Fund Now
                            </button>
                            <button
                                onClick={() => setLiked(!liked)}
                                className=" px-4 py-3 bg-slate-100 dark:bg-dark-700 hover:bg-slate-200 dark:hover:bg-dark-600 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition-colors"
                            >
                                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* ESG Report Download */}
                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-dark-700">
                            {/* ESG Score Preview */}
                            {esgScore && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-4 rounded-xl border-2 flex items-center gap-3"
                                    style={{
                                        borderColor: esgScore.color,
                                        backgroundColor: esgScore.color + '15'
                                    }}
                                >
                                    <div className="flex-1">
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-1">ESG Score</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-2xl font-black" style={{ color: esgScore.color }}>
                                                {esgScore.overall?.toFixed(1) || 'N/A'}
                                            </p>
                                            <p className="text-xs font-bold uppercase" style={{ color: esgScore.color }}>
                                                {esgScore.label}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Sub-Scores</p>
                                        <div className="flex flex-col gap-0.5 text-xs font-bold">
                                            <span>E: {esgScore.environmental?.toFixed(1) || 'N/A'}</span>
                                            <span>S: {esgScore.social?.toFixed(1) || 'N/A'}</span>
                                            <span>G: {esgScore.governance?.toFixed(1) || 'N/A'}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {loadingESG && (
                                <div className="mb-4 p-4 rounded-xl border border-slate-200 dark:border-dark-700 flex items-center justify-center gap-2">
                                    <LoaderIcon size={16} className="animate-spin text-slate-400" />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Loading ESG metrics...</p>
                                </div>
                            )}

                            <button
                                onClick={handleDownloadReport}
                                disabled={downloadingReport}
                                className="w-full px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {downloadingReport ? (
                                    <>
                                        <LoaderIcon size={18} className="animate-spin" /> Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download size={18} /> Download ESG Report
                                    </>
                                )}
                            </button>

                            {reportError && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-red-600 dark:text-red-400 mt-2 text-center"
                                >
                                    {reportError}
                                </motion.p>
                            )}
                        </div>
                    </motion.div>

                    {/* Trust Score */}
                    {project.ngoTrustScore && (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className={`${riskBadge.bgLight} rounded-3xl border ${riskBadge.color} border-current p-6`}
                        >
                            <div className="flex items-start gap-3">
                                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold mb-1">Organization Trust Score</h3>
                                    <p className="text-sm font-semibold">{project.ngoTrustScore}/10</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Recent Funders */}
            {fundings.length > 0 && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-dark-800 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-800 p-8"
                >
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Recent Supporters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {fundings.slice(0, 4).map((funding) => (
                            <div key={funding._id} className="bg-slate-50 dark:bg-dark-900/50 p-4 rounded-2xl border border-slate-100 dark:border-dark-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-emerald-400 flex items-center justify-center text-sm font-bold text-white">
                                        {funding.investorId?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {funding.investorId?.name || 'Anonymous'}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(funding.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-lg font-black text-primary-600 dark:text-primary-400">
                                    ${funding.amount.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Funding Modal */}
            <FundingModal
                isOpen={fundingModal}
                onClose={() => setFundingModal(false)}
                project={project}
                onSuccess={handleFundingSuccess}
            />
        </div>
    );
};

export default ProjectDetail;
