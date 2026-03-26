import api from './api';

export const getCustomers = async () => {
    const response = await api.get('/customers');
    return response.data;
};

export const getCustomerById = async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
};

export const createCustomer = async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
};

export const updateCustomer = async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
};

export const deleteCustomer = async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
};
