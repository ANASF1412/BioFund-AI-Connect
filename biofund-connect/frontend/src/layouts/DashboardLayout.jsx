import React from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-dark-900 transition-colors duration-300">
            <Navbar />
            <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
                <Sidebar className="hidden md:block" />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
