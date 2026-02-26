import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import projectService from '../../services/projectService';
import Loader from '../../components/common/Loader';
import { motion } from 'framer-motion';
import { TreePine, Droplets, Target, ArrowUpRight, ShieldCheck, Trophy } from 'lucide-react';

const ImpactTracker = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        trees: 0,
        water: 0,
        wildlife: 0,
        totalFunds: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // Derive global stats from active projects
                const res = await projectService.getProjects();
                const approved = res.data.filter(p => p.status === 'Approved' || p.status === 'Completed');

                let totalTrees = 0; let totalWater = 0; let totalWildlife = 0; let funds = 0;
                approved.forEach(p => {
                    funds += p.currentAmount;
                    if (p.impacts) {
                        totalTrees += (p.impacts.treesPlanted || 0);
                        totalWater += (p.impacts.waterSaved || 0);
                        totalWildlife += (p.impacts.wildlifeSaved || 0);
                    }
                });

                // Use fallback gamified logic if no real DB impacts exist yet due to seed
                setStats({
                    trees: totalTrees || Math.floor(funds * 0.5),
                    water: totalWater || Math.floor(funds * 12.5),
                    wildlife: totalWildlife || Math.floor(funds * 0.01),
                    totalFunds: funds
                });

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center py-6">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white flex justify-center items-center gap-2">
                    <Target size={32} className="text-primary-500" /> Global Impact Tracker
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Watch real-time environmental ROI (Return on Impact). These metrics represent the combined efforts of the entire BioFund ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-colors"></div>
                    <TreePine size={32} className="text-emerald-500 mb-4" />
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white font-sans mb-1">
                        <CountUp end={stats.trees} separator="," duration={2.5} />
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trees Seeded</p>
                </motion.div>

                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors"></div>
                    <Droplets size={32} className="text-blue-500 mb-4" />
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white font-sans mb-1">
                        <CountUp end={stats.water} separator="," duration={3} />
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gallons Saved</p>
                </motion.div>

                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 dark:bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-colors"></div>
                    <ShieldCheck size={32} className="text-amber-500 mb-4" />
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white font-sans mb-1">
                        <CountUp end={stats.wildlife} separator="," duration={3.5} />
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Wildlife Protected</p>
                </motion.div>

                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-primary-600 to-teal-700 dark:from-primary-900 dark:to-teal-900 rounded-3xl p-6 shadow-xl shadow-primary-500/20 border border-primary-500/50 relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <Target size={32} className="text-white mb-4 drop-shadow-md" />
                    <h2 className="text-4xl font-black text-white font-sans mb-1 drop-shadow-md">
                        $<CountUp end={stats.totalFunds} separator="," duration={2} />
                    </h2>
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Capital Raised</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 border border-slate-100 dark:border-dark-800 soft-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Trophy size={24} className="text-amber-500" /> Universal Leaderboard</h3>
                    </div>
                    <div className="space-y-4">
                        {/* Moackup Gamification Data */}
                        {['Jane Goodall (143k pts)', 'EcoWarrior99 (112k pts)', 'GreenTech Inc (89k pts)', 'OceanSaver (67k pts)'].map((name, i) => (
                            <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${i === 0 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50' : 'bg-slate-50 dark:bg-dark-900/50'} border border-slate-100 dark:border-dark-800`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 dark:bg-dark-700 text-slate-600 dark:text-slate-400'}`}>#{i + 1}</div>
                                <span className="font-bold text-sm text-slate-900 dark:text-white">{name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-dark-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden soft-shadow">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                    <div className="relative z-10 flex flex-col h-full justify-center">
                        <h3 className="text-3xl font-black mb-4 leading-tight">Your streak determines your planetary rank.</h3>
                        <p className="text-slate-400 font-medium mb-8 max-w-sm">Every new contribution pushes your impact multiplier up, allowing your dollars to unlock exclusive platform badges.</p>
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/investor/explore')} className="bg-primary-500 hover:bg-primary-400 text-dark-900 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/20">
                                Keep Streaking <ArrowUpRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImpactTracker;
