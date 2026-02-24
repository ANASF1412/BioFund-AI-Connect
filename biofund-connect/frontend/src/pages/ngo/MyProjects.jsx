import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import projectService from '../../services/projectService';
import Loader from '../../components/common/Loader';
import { Pencil, Trash2, Milestone, Eye } from 'lucide-react';

const MyProjects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await projectService.getProjects();
                const myProjects = res.data.filter(p => p.createdBy?._id === user._id || p.createdBy === user._id);
                setProjects(myProjects);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [user]);

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Project Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Funding Progress
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200 text-sm">
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                        You haven't created any projects yet.
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-900">{project.title}</div>
                                            <div className="text-xs text-slate-500">{new Date(project.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${project.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                                    project.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-full max-w-xs">
                                                <div className="flex justify-between text-xs font-medium mb-1">
                                                    <span>${project.currentAmount.toLocaleString()}</span>
                                                    <span className="text-slate-500">${project.goalAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                                    <div
                                                        className="bg-primary-500 h-1.5 rounded-full"
                                                        style={{ width: `${Math.min((project.currentAmount / project.goalAmount) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                            <button title="View Details" className="text-slate-400 hover:text-primary-600 transition-colors">
                                                <Eye size={18} />
                                            </button>
                                            <button title="Manage Milestones" className="text-slate-400 hover:text-indigo-600 transition-colors">
                                                <Milestone size={18} />
                                            </button>
                                            <button title="Edit Project" className="text-slate-400 hover:text-amber-600 transition-colors">
                                                <Pencil size={18} />
                                            </button>
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

export default MyProjects;
