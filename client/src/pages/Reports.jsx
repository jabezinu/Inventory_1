import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { getSalesReport, getStockReport, getProfitReport } from '../services/reportService';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('sales');
    const [salesData, setSalesData] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [profitData, setProfitData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [sales, stock, profit] = await Promise.all([
                getSalesReport(),
                getStockReport(),
                getProfitReport()
            ]);

            // Transform data for charts
            setSalesData(sales.map(s => ({
                date: s.period,
                revenue: parseFloat(s.totalRevenue || 0),
                quantity: parseFloat(s.totalQuantity || 0),
                profit: parseFloat(s.totalProfit || 0)
            })));

            setStockData(stock);

            setProfitData(profit.map(p => ({
                date: p.period,
                profit: parseFloat(p.totalProfit || 0)
            })));

        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Reports...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Reports</h1>

            <div className="flex space-x-4 border-b">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'sales' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('sales')}
                >
                    Sales Report
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'stock' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('stock')}
                >
                    Stock Report
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'profit' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('profit')}
                >
                    Profit Report
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                {activeTab === 'sales' && (
                    <div className="space-y-8">
                        <h2 className="text-xl font-bold">Sales Overview</h2>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                                    <Bar dataKey="profit" fill="#10B981" name="Profit" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Detailed Daily Sales</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Items Sold</th>
                                            <th className="p-3">Total Revenue</th>
                                            <th className="p-3">Total Profit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salesData.map((day, idx) => (
                                            <tr key={idx} className="border-b">
                                                <td className="p-3">{day.date}</td>
                                                <td className="p-3">{day.quantity}</td>
                                                <td className="p-3">${day.revenue.toFixed(2)}</td>
                                                <td className="p-3">${day.profit.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'stock' && (
                    <div className="space-y-8">
                        <h2 className="text-xl font-bold">Stock Analysis</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="h-80">
                                <h3 className="text-center mb-4">Stock Value Distribution (Top 10)</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={[...stockData]
                                            .sort((a, b) => (b.stockQuantity * b.averageCost) - (a.stockQuantity * a.averageCost))
                                            .slice(0, 10)
                                            .map(item => ({
                                                name: item.product,
                                                value: item.stockQuantity * item.averageCost
                                            }))
                                        }
                                        layout="vertical"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={100} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#8884d8" name="Stock Value ($)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="overflow-y-auto max-h-96">
                                <h3 className="font-bold mb-2">Low Stock Alert</h3>
                                <table className="w-full">
                                    <thead className="bg-red-50">
                                        <tr>
                                            <th className="p-2 text-left">Product</th>
                                            <th className="p-2 text-left">Stock</th>
                                            <th className="p-2 text-left">Threshold</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockData
                                            .filter(item => item.isLowStock)
                                            .map((item, idx) => (
                                                <tr key={idx} className="border-b">
                                                    <td className="p-2">{item.product}</td>
                                                    <td className="p-2 text-red-600 font-bold">{item.stockQuantity}</td>
                                                    <td className="p-2">{item.lowStockThreshold}</td>
                                                </tr>
                                            ))}
                                        {stockData.filter(item => item.isLowStock).length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="p-4 text-center text-gray-500">No low stock items.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'profit' && (
                    <div className="space-y-8">
                        <h2 className="text-xl font-bold">Profit Trends</h2>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={profitData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} name="Daily Profit" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
