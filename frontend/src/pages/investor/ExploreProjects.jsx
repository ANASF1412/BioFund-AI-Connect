import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../../services/projectService';
import Loader from '../../components/common/Loader';
import FundingModal from '../../components/common/FundingModal';
import { Leaf, Droplets, MapPin, Search, Filter, LeafyGreen, TreePine, Trees, Wind, X, Globe, ChevronDown, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
    { name: 'All', icon: <Trees size={16} /> },
    { name: 'Forest', icon: <TreePine size={16} /> },
    { name: 'Wildlife', icon: <LeafyGreen size={16} /> },
    { name: 'Water', icon: <Droplets size={16} /> },
    { name: 'Agriculture', icon: <Leaf size={16} /> },
];

const getRiskBadge = (riskScore) => {
    if (riskScore <= 3) return { label: 'Low Risk', color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' };
    if (riskScore <= 6) return { label: 'Medium Risk', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' };
    return { label: 'High Risk', color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' };
};

const ExploreProjects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [fundingModal, setFundingModal] = useState({ open: false, project: null });
    const [filters, setFilters] = useState({
        location: '',
        minFunding: '',
        maxFunding: '',
    });

    const fetchProjects = async (queryParams = {}) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (searchTerm) params.append('search', searchTerm);
            if (activeCategory !== 'All') params.append('impactType', activeCategory);
            if (filters.location) params.append('location', filters.location);
            if (filters.minFunding) params.append('minFunding', filters.minFunding);
            if (filters.maxFunding) params.append('maxFunding', filters.maxFunding);

            const response = await projectService.getProjects();
            const approvedOnly = response.data.filter(p => p.status === 'Approved');
            setProjects(approvedOnly);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [searchTerm, activeCategory, filters]);

    const filteredProjects = projects.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Check category/impactType
        let categoryMatch = true;
        if (activeCategory !== 'All') {
            categoryMatch = (p.impactType === activeCategory) || (p.category === activeCategory);
        }

        // Check location filter
        let locationMatch = true;
        if (filters.location) {
            locationMatch = (p.location?.name || '').toLowerCase().includes(filters.location.toLowerCase());
        }

        // Check funding range
        let fundingMatch = true;
        if (filters.minFunding) {
            fundingMatch = fundingMatch && (p.currentAmount >= parseFloat(filters.minFunding));
        }
        if (filters.maxFunding) {
            fundingMatch = fundingMatch && (p.goalAmount <= parseFloat(filters.maxFunding));
        }

        return matchSearch && categoryMatch && locationMatch && fundingMatch;
    });

    const handleFundClick = (project) => {
        setFundingModal({ open: true, project });
    };

    const handleFundingSuccess = () => {
        fetchProjects();
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-dark-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-800">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Globe size={32} className="text-primary-500 hidden sm:block" /> Explore Biosphere
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">Discover validated conservation efforts spanning across the globe.</p>
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-80 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-dark-700 rounded-xl leading-5 bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-3 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
                    >
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white dark:bg-dark-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-800"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Location Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search by location"
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-dark-700 rounded-lg bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                                />
                            </div>

                            {/* Min Funding Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Min Goal Amount
                                </label>
                                <input
                                    type="number"
                                    placeholder="Min amount"
                                    value={filters.minFunding}
                                    onChange={(e) => setFilters({ ...filters, minFunding: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-dark-700 rounded-lg bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                                />
                            </div>

                            {/* Max Funding Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Max Goal Amount
                                </label>
                                <input
                                    type="number"
                                    placeholder="Max amount"
                                    value={filters.maxFunding}
                                    onChange={(e) => setFilters({ ...filters, maxFunding: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-dark-700 rounded-lg bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        <button
                            onClick={() => setFilters({ location: '', minFunding: '', maxFunding: '' })}
                            className="mt-4 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map(c => (
                    <button
                        key={c.name}
                        onClick={() => setActiveCategory(c.name)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${activeCategory === c.name
                            ? 'bg-primary-500 text-white shadow-primary-500/30 -translate-y-0.5'
                            : 'bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-700 hover:-translate-y-0.5'
                            }`}
                    >
                        {c.icon} {c.name}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-dark-800 rounded-3xl border border-slate-100 dark:border-dark-800 soft-shadow">
                    <Filter className="mx-auto h-16 w-16 text-slate-200 dark:text-dark-700 mb-6" />
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Barren Lands</h3>
                    <p className="text-slate-500 dark:text-slate-400">No projects found. Try adjusting your filters!</p>
                </div>
            ) : (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredProjects.map((project) => {
                            const progress = Math.min((project.currentAmount / project.goalAmount) * 100, 100);
                            const riskBadge = getRiskBadge(project.riskScore || 0);

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={project._id}
                                    className="bg-white dark:bg-dark-800 rounded-3xl border border-slate-100 dark:border-dark-800 soft-shadow overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 relative cursor-pointer"
                                    onClick={() => navigate(`/investor/project/${project._id}`)}
                                >
                                    <div className="h-56 bg-slate-100 relative overflow-hidden">
                                        <img
                                            src={`https://source.unsplash.com/600x400/?${project.category || 'nature'},conservation,${project._id}`}
                                            alt="Project Bio"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600&h=400'; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent"></div>

                                        <div className="absolute top-4 left-4 flex items-center gap-2">
                                            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm border border-white/20 flex items-center gap-1">
                                                {project.category === 'Water' ? <Droplets size={12} /> : <TreePine size={12} />}
                                                {project.impactType || project.category || 'Forest'}
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${riskBadge.color}`}>
                                                {riskBadge.label}
                                            </div>
                                        </div>

                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <div className="flex items-center text-xs font-medium text-white/80 mb-1 drop-shadow-md">
                                                <MapPin size={14} className="mr-1" />
                                                <span className="truncate">{project.location?.name || `${project.location?.latitude?.toFixed(2) || 'N/A'}, ${project.location?.longitude?.toFixed(2) || 'N/A'}`}</span>
                                            </div>
                                            <h3 className="text-xl font-black mb-1 line-clamp-1 drop-shadow-lg">{project.title}</h3>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">{project.description}</p>

                                        {/* Funder Count */}
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
                                            <Users size={14} />
                                            <span>{project.fundingCount || 0} investor{(project.fundingCount || 0) !== 1 ? 's' : ''}</span>
                                        </div>

                                        <div className="mt-auto bg-slate-50 dark:bg-dark-900/50 p-4 rounded-2xl border border-slate-100 dark:border-dark-800/50 mb-4">
                                            <div className="flex justify-between items-end mb-2">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">Funded</p>
                                                    <span className="font-black text-lg text-slate-900 dark:text-white">${project.currentAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">Goal</p>
                                                    <span className="font-bold text-sm text-slate-500 dark:text-slate-400">${project.goalAmount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-dark-700 rounded-full h-2 mb-1 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }} whileInView={{ width: `${progress}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}
                                                    className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-primary-500'}`}
                                                />
                                            </div>
                                            <div className="text-right text-xs font-bold text-primary-600 dark:text-primary-400">{progress.toFixed(0)}%</div>
                                        </div>

                                        {/* Fund Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFundClick(project);
                                            }}
                                            className="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors shadow-sm"
                                        >
                                            Fund Project
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Funding Modal */}
            <FundingModal
                isOpen={fundingModal.open}
                onClose={() => setFundingModal({ open: false, project: null })}
                project={fundingModal.project}
                onSuccess={handleFundingSuccess}
            />
        </div>
    );
};

export default ExploreProjects;
