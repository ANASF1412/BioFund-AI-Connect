import api from './api';

const getProjects = async () => {
    const response = await api.get('/projects');
    return response.data;
};

const getProjectById = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

const createProject = async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
};

const updateProjectStatus = async (id, status) => {
    const response = await api.put(`/projects/${id}/status`, { status });
    return response.data;
};

export default {
    getProjects,
    getProjectById,
    createProject,
    updateProjectStatus,
};
