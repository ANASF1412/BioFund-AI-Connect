import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import projectService from '../../services/projectService';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Droplets, TreePine, Leaf, Globe, Filter, X, MapPin, TrendingUp, Users,
    Zap, BarChart3, ChevronDown
} from 'lucide-react';

// Fix default Leaflet marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createMarker = (riskScore) => {
    let color = '#10b981'; // Green - Low Risk
    if (riskScore > 3 && riskScore <= 6) color = '#f59e0b'; // Amber - Medium Risk
    if (riskScore > 6) color = '#ef4444'; // Red - High Risk

    return L.divIcon({
        html: `
            <div style="
                background-color: ${color};
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s;
            ">
                <div style="
                    background-color: ${color};
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                "></div>
            </div>
        `,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
};

const getRiskColor = (riskScore) => {
    if (riskScore <= 3) return { label: 'Low Risk', color: 'bg-emerald-500', textColor: 'text-emerald-700', badge: 'bg-emerald-100 dark:bg-emerald-900/40' };
    if (riskScore <= 6) return { label: 'Medium Risk', color: 'bg-amber-500', textColor: 'text-amber-700', badge: 'bg-amber-100 dark:bg-amber-900/40' };
    return { label: 'High Risk', color: 'bg-red-500', textColor: 'text-red-700', badge: 'bg-red-100 dark:bg-red-900/40' };
};

const MapController = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center && zoom) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
};

const ImpactMap = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
    const [mapZoom, setMapZoom] = useState(5);

    const [filters, setFilters] = useState({
        impactType: 'All',
        riskLevel: 'All',
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await projectService.getProjects();
                const approvedOnly = response.data.filter(p => p.status === 'Approved');
                setProjects(approvedOnly);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Filter projects
    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            if (filters.impactType !== 'All' && (p.impactType || p.category) !== filters.impactType) {
                return false;
            }
            if (filters.riskLevel !== 'All') {
                const riskScore = p.riskScore || 0;
                if (filters.riskLevel === 'Low' && riskScore > 3) return false;
                if (filters.riskLevel === 'Medium' && (riskScore <= 3 || riskScore > 6)) return false;
                if (filters.riskLevel === 'High' && riskScore <= 6) return false;
            }
            return true;
        });
    }, [projects, filters]);

    if (loading) return <Loader />;

    const impactTypes = [
        { name: 'All', icon: <Globe size={16} /> },
        { name: 'Forest', icon: <TreePine size={16} /> },
        { name: 'Water', icon: <Droplets size={16} /> },
        { name: 'Wildlife', icon: <Leaf size={16} /> },
        { name: 'Agriculture', icon: <Leaf size={16} /> },
    ];

    const riskLevels = [
        { name: 'All', label: 'All Levels' },
        { name: 'Low', label: 'Low Risk' },
        { name: 'Medium', label: 'Medium Risk' },
        { name: 'High', label: 'High Risk' },
    ];

    return (
        <div className="relative w-full h-screen flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-white dark:bg-dark-800 shadow-lg border-b border-slate-100 dark:border-dark-700">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                <MapPin size={32} className="text-primary-500" /> Live Impact Map
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
                                Visualize conservation projects across the globe
                            </p>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-3 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
                        >
                            <Filter size={18} /> Filters
                        </button>
                    </div>

                    {/* Filters Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 pt-6 border-t border-slate-100 dark:border-dark-700"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Impact Type Filter */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
                                            Impact Type
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {impactTypes.map(type => (
                                                <button
                                                    key={type.name}
                                                    onClick={() => setFilters({ ...filters, impactType: type.name })}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${filters.impactType === type.name
                                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                                        : 'bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-600'
                                                        }`}
                                                >
                                                    {type.icon} {type.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Risk Level Filter */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
                                            Risk Level
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {riskLevels.map(level => (
                                                <button
                                                    key={level.name}
                                                    onClick={() => setFilters({ ...filters, riskLevel: level.name })}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filters.riskLevel === level.name
                                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                                        : 'bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-600'
                                                        }`}
                                                >
                                                    {level.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setFilters({ impactType: 'All', riskLevel: 'All' })}
                                    className="mt-4 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative flex-1 -top-[140px] md:-top-[120px]">
                <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ width: '100%', height: '100%' }}
                    className="rounded-b-3xl"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    <MapController center={mapCenter} zoom={mapZoom} />

                    {filteredProjects.map((project) => {
                        const lat = project.coordinates?.lat || project.location?.latitude;
                        const lng = project.coordinates?.lng || project.location?.longitude;

                        if (!lat || !lng) return null;

                        const riskScore = project.riskScore || 0;
                        const progress = Math.min((project.currentAmount / project.goalAmount) * 100, 100);
                        const riskInfo = getRiskColor(riskScore);

                        return (
                            <Marker
                                key={project._id}
                                position={[lat, lng]}
                                icon={createMarker(riskScore)}
                            >
                                <Popup className="custom-popup">
                                    <div className="w-64 p-3">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{project.title}</h3>

                                        <div className="space-y-2 mb-3 text-sm">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <MapPin size={14} />
                                                <span>{project.location?.name || 'Global location'}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${riskInfo.badge} ${riskInfo.textColor}`}>
                                                    {riskInfo.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Funding Progress */}
                                        <div className="mb-3 pb-3 border-b border-slate-200">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-semibold text-slate-600">Funded</span>
                                                <span className="text-xs font-bold text-primary-600">{progress.toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                                                <div
                                                    className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-primary-500'}`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                ${project.currentAmount.toLocaleString()} / ${project.goalAmount.toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Info Row */}
                                        <div className="flex items-center gap-3 mb-3 text-xs text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <Users size={14} />
                                                <span>{project.fundingCount || 0} investors</span>
                                            </div>
                                        </div>

                                        {/* View Details Button */}
                                        <button
                                            onClick={() => navigate(`/investor/project/${project._id}`)}
                                            className="w-full px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            {/* Legend */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-6 left-6 bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-slate-100 dark:border-dark-700 p-6 z-10 max-w-xs"
            >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 size={16} /> Risk Level Legend
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Low Risk (0-3)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-amber-500 shadow-sm"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Medium Risk (4-6)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">High Risk (7-10)</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-dark-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                    </p>
                </div>
            </motion.div>

            {/* No Projects Message */}
            {filteredProjects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center z-5 bg-black/30 rounded-b-3xl"
                >
                    <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 text-center max-w-sm">
                        <MapPin size={48} className="mx-auto mb-4 text-slate-300" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Projects Found</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Try adjusting your filters to see projects on the map.
                        </p>
                        <button
                            onClick={() => setFilters({ impactType: 'All', riskLevel: 'All' })}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ImpactMap;
