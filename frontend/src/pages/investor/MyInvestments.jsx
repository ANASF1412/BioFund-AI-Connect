import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fundingService from '../../services/fundingService';
import Loader from '../../components/common/Loader';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Calendar, MapPin, Target, Package } from 'lucide-react';

const MyInvestments = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ investments: [], stats: { totalInvested: 0, projectsSupported: 0, fundingCount: 0 } });
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('date');

    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                const response = await fundingService.getMyInvestments();
                console.log('Investments response:', response);
                // API response has structure: { success, message, data: { investments, stats } }
                const { investments = [], stats = { totalInvested: 0, projectsSupported: 0, fundingCount: 0 } } = response.data || response;
                setData({ investments, stats });
            } catch (error) {
                console.error('Failed to fetch investments', error);
                setData({ investments: [], stats: { totalInvested: 0, projectsSupported: 0, fundingCount: 0 } });
            } finally {
                setLoading(false);
            }
        };
        fetchInvestments();
    }, []);

    if (loading) return <Loader />;

    const { investments, stats } = data;

    // Sort investments
    const sortedInvestments = [...investments].sort((a, b) => {
        if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'amount') return b.amount - a.amount;
        return 0;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-primary-900/20">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 blur-[1px]"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold tracking-tight">My Investments</h1>
                    <p className="text-primary-200 mt-1 font-medium">Track your funding across conservation projects</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-800 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                            <TrendingUp size={28} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Invested</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white">${stats.totalInvested?.toLocaleString() || 0}</p>
                    </div>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-800 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
                            <Package size={28} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Projects Funded</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white">{stats.projectsSupported || 0}</p>
                    </div>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-800 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                            <Target size={28} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Investments</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white">{stats.fundingCount || 0}</p>
                    </div>
                </motion.div>
            </div>

            {/* Investments Table/List */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-dark-800 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-800 p-8"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Investment History</h2>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="date">Sort: Latest</option>
                        <option value="amount">Sort: Highest Amount</option>
                    </select>
                </div>

                {investments.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="mx-auto mb-4 text-slate-300 dark:text-slate-700" size={48} />
                        <p className="text-slate-600 dark:text-slate-400 mb-4">No investments yet. Start funding projects to make an impact!</p>
                        <button
                            onClick={() => navigate('/investor/explore')}
                            className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold transition-colors"
                        >
                            Explore Projects
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedInvestments.map((inv, idx) => (
                            <motion.div
                                key={inv._id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => navigate(`/investor/project/${inv.projectId._id}`)}
                                className="p-6 bg-slate-50 dark:bg-dark-900/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-slate-100 dark:border-dark-700 hover:border-primary-200 dark:hover:border-primary-800/50 rounded-2xl transition-all cursor-pointer group"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                                            {inv.projectId?.title || 'Unknown Project'}
                                        </h3>
                                        <div className="flex flex-col md:flex-row gap-4 text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} />
                                                {new Date(inv.createdAt).toLocaleDateString()}
                                            </div>
                                            {inv.projectId?.location?.name && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} />
                                                    {inv.projectId.location.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">You invested</p>
                                            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                ${inv.amount.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${inv.status === 'Completed'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                                                : inv.status === 'Active'
                                                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                }`}>
                                                {inv.status}
                                            </span>
                                        </div>

                                        <ArrowUpRight className="text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" size={24} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default MyInvestments;
