import React, { useState, useEffect } from 'react';
import projectService from '../../services/projectService';
import Loader from '../../components/common/Loader';
import { ShieldAlert, Users, FolderKanban, Activity, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [data, setData] = useState({ projects: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await projectService.getProjects();
            setData({ projects: res.data });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this project?`)) {
            try {
                await projectService.updateProjectStatus(id, { status });
                fetchData();
            } catch (error) {
                console.error(error);
                alert('Failed to update project status');
            }
        }
    };

    if (loading) return <Loader />;

    const pendingProjects = data.projects.filter(p => p.status === 'Pending');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 dark:bg-dark-900 border border-slate-800 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/connected.png')] opacity-10"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <ShieldAlert size={32} className="text-rose-500" /> Admin Oversight Level 4
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Global systemic validation and protocol enforcement console.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-800 flex items-center gap-5">
                    <div className="p-4 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full">
                        <FolderKanban size={32} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Awaiting Approval</p>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{pendingProjects.length}</h2>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-800 flex items-center gap-5">
                    <div className="p-4 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full">
                        <Activity size={32} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active System Nodes</p>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{data.projects.filter(p => p.status === 'Approved').length}</h2>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-dark-800 flex items-center gap-5">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Registered Entities</p>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Admin Only</h2>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 border border-slate-100 dark:border-dark-800 soft-shadow">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">High-Priority Review Queue</h2>

                {pendingProjects.length === 0 ? (
                    <div className="text-center py-12">
                        <ShieldAlert className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Queue is completely empty. Protocol status is nominal.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-dark-700">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project ID & Integrity Check</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sponsor NGO</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Capital Request</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Execute Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-dark-700">
                                <AnimatePresence>
                                    {pendingProjects.map(p => (
                                        <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }} key={p._id} className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors">
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{p._id}</div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                                {p.createdBy?.name || 'Unknown Protocol Sender'}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-emerald-600 dark:text-emerald-400">
                                                ${p.goalAmount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap table-cell text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleStatusUpdate(p._id, 'Approved')} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 dark:text-emerald-400 p-2 rounded-xl transition-colors">
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(p._id, 'Rejected')} className="bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-900/40 dark:hover:bg-rose-900/60 dark:text-rose-400 p-2 rounded-xl transition-colors">
                                                        <XCircle size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
