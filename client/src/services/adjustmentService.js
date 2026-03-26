import api from './api';

export const getAdjustments = async () => {
    const response = await api.get('/adjustments');
    return response.data;
};

export const createAdjustment = async (adjustmentData) => {
    const response = await api.post('/adjustments', adjustmentData);
    return response.data;
};
