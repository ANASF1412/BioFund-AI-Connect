import api from './api';

const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
};

const login = async (userData) => {
    const response = await api.post('/auth/login', userData);
    if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export default {
    register,
    login,
    logout,
    getMe,
};
