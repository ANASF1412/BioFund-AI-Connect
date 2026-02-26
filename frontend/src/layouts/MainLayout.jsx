import React from 'react';
import Navbar from '../components/common/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-dark-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-white dark:bg-dark-900 border-t border-slate-200 dark:border-dark-800 py-8 transition-colors duration-300 relative z-10 w-full">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                    <p className="mb-2 uppercase tracking-widest text-[10px] text-primary-500 font-bold">BioFund Connect Universe</p>
                    &copy; {new Date().getFullYear()} BioFund Connect. Empowering Biodiversity through Transparency.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
