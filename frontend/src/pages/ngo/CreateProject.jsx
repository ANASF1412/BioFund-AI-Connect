import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../../services/projectService';
import { Target, MapPin, AlignLeft, DollarSign, AlertCircle } from 'lucide-react';

const CreateProject = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        latitude: '',
        longitude: '',
        goalAmount: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const projectData = {
                title: formData.title,
                description: formData.description,
                location: {
                    latitude: Number(formData.latitude),
                    longitude: Number(formData.longitude)
                },
                goalAmount: Number(formData.goalAmount)
            };

            await projectService.createProject(projectData);
            navigate('/ngo/projects');
        } catch (err) {
            setError(err.message || 'Failed to create project');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Create New Project</h1>
                <button
                    onClick={() => navigate('/ngo/projects')}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 rounded-md bg-red-50 flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 shrink-0" />
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Project Title
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Target className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="E.g., Save the Rainforest"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Project Description
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <AlignLeft className="h-5 w-5 text-slate-400" />
                                </div>
                                <textarea
                                    name="description"
                                    required
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Detailed description of the environmental impact..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Location (Lat/Long) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Latitude
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        required
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        placeholder="e.g. 45.123"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Longitude
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        required
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        placeholder="e.g. -122.45"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Goal Amount */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Funding Goal (USD)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="number"
                                    name="goalAmount"
                                    required
                                    min="100"
                                    value={formData.goalAmount}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm lg:text-lg font-medium"
                                    placeholder="50000"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex justify-center py-2.5 px-8 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? 'Creating...' : 'Submit Project for Approval'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;
