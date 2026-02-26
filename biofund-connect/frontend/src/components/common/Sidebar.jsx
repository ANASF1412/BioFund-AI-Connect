import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Compass, Briefcase, PlusCircle, Users, Activity, LeafyGreen, MapPin, Globe } from 'lucide-react';

const Sidebar = () => {
    const { user } = useAuth();

    const getLinks = () => {
        switch (user?.role) {
            case 'Investor':
                return [
                    { name: 'Impact Dashboard', path: '/investor', icon: <LayoutDashboard size={20} /> },
                    { name: 'Explore Bio-Projects', path: '/investor/explore', icon: <Compass size={20} /> },
                    { name: 'Live Impact Map', path: '/investor/map', icon: <MapPin size={20} /> },
                    { name: 'My Portfolio', path: '/investor/investments', icon: <Briefcase size={20} /> },
                    { name: 'Global Impact Tracker', path: '/investor/tracker', icon: <Activity size={20} /> },
                ];
            case 'NGO':
                return [
                    { name: 'NGO Dashboard', path: '/ngo', icon: <LayoutDashboard size={20} /> },
                    { name: 'My Campaigns', path: '/ngo/projects', icon: <Briefcase size={20} /> },
                    { name: 'Launch Project', path: '/ngo/create-project', icon: <PlusCircle size={20} /> },
                ];
            case 'Admin':
                return [
                    { name: 'Console', path: '/admin', icon: <LayoutDashboard size={20} /> },
                    { name: 'Approvals', path: '/admin/projects', icon: <Briefcase size={20} /> },
                    { name: 'User Matrix', path: '/admin/users', icon: <Users size={20} /> },
                ];
            default:
                return [];
        }
    };

    const links = getLinks();

    return (
        <div className="w-64 bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-dark-800 text-slate-800 dark:text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col transition-colors duration-300 shadow-xl shadow-slate-200/50 dark:shadow-none z-10 relative">
            <div className="py-6 flex-1 px-4">
                <div className="mb-6 px-3 text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                    Command Center
                </div>
                <nav className="space-y-1.5">
                    {links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            end={link.path.split('/').length === 2}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100 dark:border-primary-900/50'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                                }`
                            }
                        >
                            <span className={`mr-3 ${link.path === window.location.pathname ? 'text-primary-500' : 'opacity-70'}`}>
                                {link.icon}
                            </span>
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* BioFund Logo / Watermark at bottom of sidebar */}
            <div className="p-6 mt-auto">
                <div className="bg-slate-50 dark:bg-dark-800/50 rounded-2xl p-4 border border-slate-100 dark:border-dark-800 text-center">
                    <div className="w-10 h-10 mx-auto bg-gradient-to-br from-primary-400 to-teal-500 rounded-full flex items-center justify-center text-white mb-2 shadow-inner">
                        <LeafyGreen size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">BioFund Connect v2.0</p>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">Earth Protocol</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
