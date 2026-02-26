import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import projectService from '../../services/projectService';
import fundingService from '../../services/fundingService';
import Loader from '../../components/common/Loader';
import { motion } from 'framer-motion';
import { Sprout, Droplets, Target, ShieldCheck, TreePine, Medal, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const InvestorDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState({ investments: [], stats: { totalInvested: 0, projectsSupported: 0, fundingCount: 0 }, recentProjects: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fundingRes, projRes] = await Promise.all([
                    fundingService.getMyInvestments(),
                    projectService.getProjects()
                ]);
                const approvedProjects = projRes.data.filter(p => p.status === 'Approved');
                // API response has structure: { success, message, data: { investments, stats } }
                const { investments = [], stats = { totalInvested: 0, projectsSupported: 0, fundingCount: 0 } } = fundingRes.data || fundingRes;
                setData({
                    investments,
                    stats,
                    recentProjects: approvedProjects.slice(0, 3)
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                setData({ investments: [], stats: { totalInvested: 0, projectsSupported: 0, fundingCount: 0 }, recentProjects: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loader />;

    const totalInvested = data.stats.totalInvested || 0;
    const supportedCount = data.stats.projectsSupported || 0;
    const fundingCount = data.stats.fundingCount || 0;

    // Render Badges safely incase it doesn't exist on older seeded users
    const userBadges = user.badges || ['Early Adopter'];
    const userPoints = user.points || 1500;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-primary-900/20">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 blur-[1px]"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>

                <div className="relative z-10 flex gap-6 items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-3xl font-bold shadow-lg shadow-emerald-500/30 border-4 border-white/10 text-dark-900">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user.name}</h1>
                        <p className="text-primary-200 mt-1 font-medium flex items-center gap-2">
                            <Medal size={16} className="text-amber-400" /> Current Rank: <strong className="text-white">Earth Champion</strong> • {userPoints} Impact Points
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-800 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                            <Sprout size={28} />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/50 px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp size={12} /> +12% this month
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Invested</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white font-sans">${totalInvested.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Across {fundingCount} investment{fundingCount !== 1 ? 's' : ''}</p>
                    </div>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-800 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400">
                            <Target size={28} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Projects Supported</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white font-sans">{supportedCount}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Active conservation efforts</p>
                    </div>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-800 p-6 flex flex-col justify-start">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-primary-500" /> Your Badges
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {userBadges.map(badge => (
                            <div key={badge} className="px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/50 flex items-center gap-1.5">
                                {badge.includes('Seed') && <TreePine size={16} className="text-emerald-500" />}
                                {badge.includes('Water') && <Droplets size={16} className="text-blue-500" />}
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{badge}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-gradient-to-br from-primary-600 to-primary-700 dark:from-primary-900 dark:to-primary-800 rounded-2xl shadow-lg border border-primary-500/30 p-8 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-5"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">Discover Projects on the Live Impact Map</h2>
                            <p className="text-primary-100 text-sm font-medium">Visualize conservation projects globally and see their funding progress in real-time.</p>
                        </div>
                        <Link
                            to="/investor/map"
                            className="px-6 py-3 bg-white hover:bg-slate-50 text-primary-600 font-bold rounded-xl transition-colors shadow-lg whitespace-nowrap"
                        >
                            <MapPin size={18} className="inline mr-2" /> View Map
                        </Link>
                    </div>
                </motion.div>

                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-800 p-6 overflow-hidden relative">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Suggested Discoveries</h2>
                        <Link to="/investor/explore" className="text-sm font-bold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {data.recentProjects.slice(0, 3).map(p => {
                            const pct = Math.min((p.currentAmount / p.goalAmount) * 100, 100);
                            return (
                                <div key={p._id} className="group p-4 bg-slate-50 dark:bg-dark-900/50 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border border-transparent hover:border-primary-200 dark:hover:border-primary-800/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors cursor-pointer">{p.title}</h3>
                                        <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">{pct.toFixed(0)}%</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">{p.description}</p>
                                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                                        <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Investments</h2>
                        <Link to="/investor/investments" className="text-sm font-bold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {data.investments.length === 0 ? (
                            <div className="text-center py-10">
                                <Sprout className="mx-auto mb-3 text-slate-300 dark:text-slate-700" size={32} />
                                <p className="text-slate-500 dark:text-slate-400 text-sm">No investments yet. Start funding projects!</p>
                                <Link to="/investor/explore" className="mt-3 inline-block text-sm font-bold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                                    Explore Projects
                                </Link>
                            </div>
                        ) : (
                            data.investments.slice(0, 4).map(inv => (
                                <div key={inv._id} className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-dark-800 last:border-0">
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">{inv.projectId?.title || 'Project'}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                            <Calendar size={12} /> {new Date(inv.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-emerald-500">${inv.amount.toLocaleString()}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold capitalize">{inv.status}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorDashboard;
