import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../context/AppContext';
import { Leaf, LogOut, Sun, Moon, Type, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme, largeText, toggleLargeText, language, toggleLanguage } = useAppContext();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 glass border-b shadow-sm dark:border-dark-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex flex-shrink-0 items-center gap-2 group">
                            <div className="p-1.5 bg-primary-100 rounded-lg dark:bg-primary-900 group-hover:bg-primary-500 transition-colors">
                                <Leaf className="h-6 w-6 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                            </div>
                            <span className="font-extrabold text-xl text-slate-800 dark:text-white tracking-tight">
                                BioFund<span className="text-primary-500 dark:text-primary-400">Connect</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-dark-800 pr-3 mr-1">
                            <button onClick={toggleLanguage} title="Translate" className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors">
                                <Globe className="h-5 w-5" />
                                <span className="sr-only">Toggle Language</span>
                            </button>
                            <button onClick={toggleLargeText} title="Accessibility: Toggle Text Size" className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors">
                                <Type className="h-5 w-5" />
                            </button>
                            <button onClick={toggleTheme} title="Toggle Theme" className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors">
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Dashboard
                                </Link>
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-dark-800 rounded-md text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link
                                    to="/login"
                                    className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary-600 hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400">
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-500 dark:text-slate-400">
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-slate-100 dark:border-dark-800 bg-white dark:bg-dark-900"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-4">
                            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-dark-800 pb-4">
                                <button onClick={toggleLanguage} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <Globe className="h-4 w-4" /> Translate
                                </button>
                                <button onClick={toggleLargeText} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <Type className="h-4 w-4" /> Larger Text
                                </button>
                            </div>

                            {user ? (
                                <div className="space-y-3">
                                    <Link onClick={() => setMobileMenuOpen(false)} to="/dashboard" className="block text-base font-medium text-slate-900 dark:text-white">Dashboard</Link>
                                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block text-base font-medium text-red-500">Log out</button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link onClick={() => setMobileMenuOpen(false)} to="/login" className="block text-center border border-slate-200 dark:border-dark-800 py-2 rounded-lg text-slate-700 dark:text-slate-300 font-semibold">Log in</Link>
                                    <Link onClick={() => setMobileMenuOpen(false)} to="/register" className="block text-center bg-primary-600 text-white py-2 rounded-lg font-bold">Get Started</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
