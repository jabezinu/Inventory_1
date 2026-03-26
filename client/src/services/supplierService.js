import api from './api';

export const getSuppliers = async () => {
    const response = await api.get('/suppliers');
    return response.data;
};

export const getSupplierById = async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
};

export const createSupplier = async (supplierData) => {
    const response = await api.post('/suppliers', supplierData);
    return response.data;
};

export const updateSupplier = async (id, supplierData) => {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    return response.data;
};

export const deleteSupplier = async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
};
