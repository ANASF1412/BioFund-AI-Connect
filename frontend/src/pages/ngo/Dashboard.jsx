import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import projectService from '../../services/projectService';
import reportService from '../../services/reportService';
import milestoneService from '../../services/milestoneService';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, LeafyGreen, Target, TreePine, MapPin, Activity, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const NgoDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState({
        projects: [],
        stats: { totalRaised: 0, approved: 0, pending: 0, totalImpactTrees: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [showMilestoneModal, setShowMilestoneModal] = useState(false);
    const [selectedProjectForMilestone, setSelectedProjectForMilestone] = useState(null);
    const [milestoneData, setMilestoneData] = useState({ title: '', description: '' });
    const [isMilestoneSubmitting, setIsMilestoneSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await projectService.getProjects();
                // Filter projects created by THIS ngo
                const myProjects = res.data.filter(p => p.createdBy._id === user._id || p.createdBy === user._id);

                let raised = 0, app = 0, pend = 0, trees = 0;
                myProjects.forEach(p => {
                    if (p.status === 'Approved' || p.status === 'Completed') {
                        app++; raised += p.currentAmount;
                        trees += p.impacts?.treesPlanted || Math.floor((p.currentAmount / 10));
                    }
                    if (p.status === 'Pending') pend++;
                });

                setData({ projects: myProjects, stats: { totalRaised: raised, approved: app, pending: pend, totalImpactTrees: trees } });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user._id]);

    const handleAddMilestone = () => {
        if (data.projects.length === 0) {
            alert('Please create a project first before adding milestones');
            return;
        }
        setSelectedProjectForMilestone(data.projects[0]._id);
        setShowMilestoneModal(true);
    };

    const handleSubmitMilestone = async () => {
        if (!milestoneData.title || !milestoneData.description) {
            alert('Please fill in all fields');
            return;
        }

        setIsMilestoneSubmitting(true);
        try {
            await milestoneService.createMilestone({
                projectId: selectedProjectForMilestone,
                title: milestoneData.title,
                description: milestoneData.description,
                fundsRequested: 0
            });
            alert('Milestone added successfully!');
            setShowMilestoneModal(false);
            setMilestoneData({ title: '', description: '' });
        } catch (error) {
            alert('Failed to add milestone: ' + error.message);
        } finally {
            setIsMilestoneSubmitting(false);
        }
    };

    const handleGenerateReport = async () => {
        if (data.projects.length === 0) {
            alert('No projects to generate report for');
            return;
        }

        const approvedProject = data.projects.find(p => p.status === 'Approved');
        if (!approvedProject) {
            alert('Please create and approve a project first');
            return;
        }

        try {
            await reportService.downloadProjectReport(approvedProject._id);
        } catch (error) {
            alert('Failed to generate report: ' + error.message);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-emerald-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-emerald-900/20">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>

                <div className="relative z-10 flex gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <LeafyGreen size={40} className="text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Organization HUB</h1>
                        <p className="text-emerald-200 mt-1 font-medium">{user.name} • Scale your conservation impact.</p>
                    </div>
                </div>
                <div className="relative z-10 mt-6 md:mt-0">
                    <Link to="/ngo/create-project" className="bg-white hover:bg-emerald-50 text-emerald-900 font-bold py-3 px-6 rounded-xl shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-2">
                        <PlusCircle size={20} /> Launch Campaign
                    </Link>
                </div>
            </div>

            {/* NGO Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-800">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Capital Raised</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white font-sans">${data.stats.totalRaised.toLocaleString()}</h3>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-800">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Projects</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white font-sans">{data.stats.approved}</h3>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-800">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Awaiting Review</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white font-sans">{data.stats.pending}</h3>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl p-6 shadow-lg shadow-primary-500/20 text-white relative overflow-hidden">
                    <div className="absolute right-[-20%] bottom-[-20%] opacity-20"><TreePine size={100} /></div>
                    <p className="text-xs font-bold text-teal-100 uppercase tracking-widest mb-1 relative z-10">Estimated ROI</p>
                    <h3 className="text-3xl font-black font-sans relative z-10">{data.stats.totalImpactTrees.toLocaleString()}<span className="text-sm"> trees</span></h3>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Campaigns Overview</h2>
                        <Link to="/ngo/projects" className="text-sm font-bold text-primary-500 hover:text-primary-600">View All</Link>
                    </div>

                    {data.projects.length === 0 ? (
                        <div className="bg-white dark:bg-dark-800 p-10 rounded-3xl border border-slate-100 dark:border-dark-800 text-center soft-shadow">
                            <Target className="mx-auto h-16 w-16 text-slate-200 dark:text-dark-700 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No active campaigns</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">Start funding your biodiversity goals today.</p>
                            <Link to="/ngo/create-project" className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-xl shadow-md">Create First Project</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.projects.slice(0, 4).map(p => {
                                const pct = Math.min((p.currentAmount / p.goalAmount) * 100, 100);
                                return (
                                    <div key={p._id} className="bg-white dark:bg-dark-800 p-5 rounded-3xl soft-shadow border border-slate-100 dark:border-dark-800 flex flex-col md:flex-row gap-6 items-center group transition-colors hover:border-primary-200 dark:hover:border-primary-900/50">
                                        <div className="w-full md:w-32 h-32 rounded-2xl bg-slate-100 dark:bg-dark-700 overflow-hidden relative shrink-0">
                                            <img
                                                src={`https://source.unsplash.com/400x400/?${p.category || 'nature'},${p._id}`}
                                                alt="campaign" className="w-full h-full object-cover"
                                            />
                                            {p.status === 'Approved' ? <div className="absolute top-2 left-2 bg-emerald-500 text-white p-1 rounded-full"><CheckCircle2 size={14} /></div>
                                                : p.status === 'Pending' ? <div className="absolute top-2 left-2 bg-amber-500 text-white p-1 rounded-full"><Clock size={14} /></div> : null}
                                        </div>
                                        <div className="flex-1 w-full">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{p.title}</h3>
                                            </div>
                                            <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 gap-3">
                                                <span className="flex items-center gap-1"><MapPin size={14} /> {p.location?.name || 'Global'}</span>
                                                <span className="flex items-center gap-1"><Activity size={14} /> {p.category || 'Forest'}</span>
                                            </div>
                                            <div className="flex justify-between items-end mb-2">
                                                <div><span className="font-black text-slate-900 dark:text-white">${p.currentAmount.toLocaleString()}</span> <span className="text-xs text-slate-500 dark:text-slate-400">raised</span></div>
                                                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Goal: ${p.goalAmount.toLocaleString()}</div>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-dark-700 rounded-full h-2 mb-1">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} className="bg-primary-500 h-2 rounded-full"></motion.div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">NGO Fast Track</h2>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-dark-800 dark:to-dark-800 rounded-3xl p-6 border border-amber-100 dark:border-dark-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Update Milestones</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Provide proof-of-work to unlock the next tranche of investor funding securely through the escrows.</p>
                        <button onClick={handleAddMilestone} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-sm shadow-md transition-colors">Add Milestone</button>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-primary-50 dark:from-dark-800 dark:to-dark-800 rounded-3xl p-6 border border-teal-100 dark:border-dark-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">View Analytics</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Export geographical data distributions and view investor engagement metrics.</p>
                        <button onClick={handleGenerateReport} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 rounded-xl text-sm shadow-md transition-colors">Generate Report</button>
                    </div>
                </div>
            </div>

            {/* Milestone Modal */}
            <AnimatePresence>
                {showMilestoneModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-dark-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Add Milestone</h2>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={milestoneData.title}
                                        onChange={(e) => setMilestoneData({ ...milestoneData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Milestone title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                    <textarea
                                        value={milestoneData.description}
                                        onChange={(e) => setMilestoneData({ ...milestoneData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Milestone description"
                                        rows="3"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowMilestoneModal(false);
                                        setMilestoneData({ title: '', description: '' });
                                    }}
                                    className="flex-1 px-4 py-2 border border-slate-200 dark:border-dark-700 rounded-lg text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitMilestone}
                                    disabled={isMilestoneSubmitting}
                                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isMilestoneSubmitting ? 'Adding...' : 'Add Milestone'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NgoDashboard;
