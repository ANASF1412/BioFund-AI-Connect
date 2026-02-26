import api from './api';

const getTransactions = async () => {
    const response = await api.get('/transactions');
    return response.data;
};

const fundProject = async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
};

export default {
    getTransactions,
    fundProject,
};
