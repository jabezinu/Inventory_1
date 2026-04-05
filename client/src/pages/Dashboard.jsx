import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import {
    DollarSign,
    Package,
    TrendingUp,
    AlertTriangle
} from 'lucide-react';
import { getSalesReport, getTotalProfit } from '../services/reportService';
import { getLowStockProducts, getProducts } from '../services/productService';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalProfit: 0,
        totalProducts: 0,
        lowStockCount: 0,
    });
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    salesReport,
                    profitData,
                    products,
                    lowStock
                ] = await Promise.all([
                    getSalesReport(),
                    getTotalProfit(),
                    getProducts(),
                    getLowStockProducts()
                ]);

                // Calculate total revenue from sales report
                const totalRevenue = salesReport.reduce((acc, curr) => acc + parseFloat(curr.totalRevenue || 0), 0);

                setStats({
                    totalRevenue,
                    totalProfit: parseFloat(profitData.totalProfit || 0),
                    totalProducts: products.length,
                    lowStockCount: lowStock.length,
                });

                // Format sales data for chart
                setSalesData(salesReport.map(item => ({
                    date: item.period,
                    revenue: parseFloat(item.totalRevenue || 0),
                    profit: parseFloat(item.totalProfit || 0)
                })));

            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Loading Dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <StatsCard
                    title="Total Profit"
                    value={`$${stats.totalProfit.toLocaleString()}`}
                    icon={TrendingUp}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="bg-purple-500"
                />
                <StatsCard
                    title="Low Stock Items"
                    value={stats.lowStockCount}
                    icon={AlertTriangle}
                    color="bg-red-500"
                />
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Sales & Profit Overview</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                            <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color} text-white`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default Dashboard;
