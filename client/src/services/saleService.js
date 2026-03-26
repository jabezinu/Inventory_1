import api from './api';

export const getSales = async () => {
    const response = await api.get('/sales');
    return response.data;
};

export const getSaleById = async (id) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
};

export const createSale = async (saleData) => {
    const response = await api.post('/sales', saleData);
    return response.data;
};
