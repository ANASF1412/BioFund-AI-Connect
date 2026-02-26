import api from './api';

const createFunding = async (projectId, amount) => {
    const response = await api.post('/funding', { projectId, amount });
    return response.data;
};

const getMyInvestments = async () => {
    const response = await api.get('/funding/my-investments');
    return response.data;
};

const getProjectFundings = async (projectId) => {
    const response = await api.get(`/funding/project/${projectId}`);
    return response.data;
};

export default {
    createFunding,
    getMyInvestments,
    getProjectFundings,
};
