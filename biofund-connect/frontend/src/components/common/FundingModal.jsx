import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import fundingService from '../../services/fundingService';

const FundingModal = ({ isOpen, onClose, project, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount greater than 0');
            return;
        }

        setLoading(true);
        try {
            await fundingService.createFunding(project._id, parseFloat(amount));
            setSuccess(true);
            setTimeout(() => {
                setAmount('');
                setSuccess(false);
                onClose();
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process funding');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl max-w-md w-full p-8"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                    Fund Project
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    {project?.title}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Success State */}
                        {success ? (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="flex justify-center mb-4">
                                    <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-full p-4">
                                        <CheckCircle size={48} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    Funding Successful!
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Your contribution of ${amount} has been recorded.
                                </p>
                            </motion.div>
                        ) : (
                            /* Form */
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Project Info */}
                                <div className="bg-slate-50 dark:bg-dark-900 p-4 rounded-2xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                            Required Funding
                                        </span>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                                            ${project?.goalAmount?.toLocaleString() || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                            Currently Funded
                                        </span>
                                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                            ${project?.currentAmount?.toLocaleString() || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* Amount Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Funding Amount
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                                            <DollarSign size={20} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-dark-700 rounded-xl leading-5 bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                            step="0.01"
                                            min="0"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800/50"
                                    >
                                        <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                                    </motion.div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 border border-slate-200 dark:border-dark-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !amount}
                                        className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : 'Confirm Funding'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default FundingModal;
