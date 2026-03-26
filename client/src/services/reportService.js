import api from './api';

export const getSalesReport = async (period) => {
    // period could be query params if implemented in backend, currently backend seems to just return all or default
    // Checking backend code: router.get('/sales', reportsController.getSalesReport);
    // It might accept query params, but looking at file listing we didn't see deep into controller logic.
    // Assuming standard GET for now.
    const response = await api.get('/reports/sales');
    return response.data;
};

export const getProfitReport = async () => {
    const response = await api.get('/reports/profit');
    return response.data;
};

export const getStockReport = async () => {
    const response = await api.get('/reports/stock');
    return response.data;
};

export const getTotalProfit = async () => {
    const response = await api.get('/reports/total-profit');
    return response.data;
}
