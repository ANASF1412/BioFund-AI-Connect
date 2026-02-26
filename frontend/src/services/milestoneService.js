import api from './api';

const getMilestonesByProject = async (projectId) => {
    const response = await api.get(`/milestones/${projectId}`);
    return response.data;
};

const createMilestone = async (milestoneData) => {
    const response = await api.post('/milestones', milestoneData);
    return response.data;
};

const updateMilestone = async (id, data) => {
    const response = await api.put(`/milestones/${id}`, data);
    return response.data;
};

export default {
    getMilestonesByProject,
    createMilestone,
    updateMilestone,
};
