import React, { useState, useEffect } from 'react';
import projectService from '../../services/projectService';
import Loader from '../../components/common/Loader';
import { CheckCircle, XCircle } from 'lucide-react';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            const response = await projectService.getProjects();
            setProjects(response.data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await projectService.updateProjectStatus(id, status);
            // Optimistic update
            setProjects(projects.map(p => p._id === id ? { ...p, status } : p));
        } catch (error) {
            console.error('Failed to update project status', error);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Manage Projects</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Project Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Created By (NGO)
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Goal Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200 text-sm">
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        No projects found.
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-900">{project.title}</div>
                                            <div className="text-xs text-slate-500 truncate w-48">{project.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-slate-900">{project.createdBy?.name || 'Unknown User'}</div>
                                            <div className="text-xs text-slate-500">{project.createdBy?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-medium">
                                            ${project.goalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${project.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                                    project.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                                        project.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-blue-100 text-blue-800'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {project.status === 'Pending' ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusChange(project._id, 'Approved')}
                                                        className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(project._id, 'Rejected')}
                                                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleStatusChange(project._id, 'Pending')}
                                                    className="text-slate-600 hover:text-slate-900 transition-colors"
                                                >
                                                    Reset
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageProjects;
