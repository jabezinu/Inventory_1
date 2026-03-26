import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { getAdjustments, createAdjustment } from '../services/adjustmentService';
import { getProducts } from '../services/productService';

const Adjustments = () => {
    const [adjustments, setAdjustments] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        product: '',
        quantity: 1,
        reason: '',
        type: 'remove'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [adjData, prodData] = await Promise.all([
                getAdjustments(),
                getProducts()
            ]);
            setAdjustments(adjData);
            setProducts(prodData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAdjustment(formData);
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error("Error creating adjustment:", error);
            alert("Error creating adjustment: " + (error.response?.data?.error || error.message));
        }
    };

    const resetForm = () => {
        setFormData({
            product: '',
            quantity: 1,
            reason: '',
            type: 'remove'
        });
    };

    const filteredAdjustments = adjustments.filter(adj =>
        adj.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adj.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center">Loading Adjustments...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Stock Adjustments</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    New Adjustment
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search adjustments..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Date</th>
                                <th className="p-4 font-semibold text-gray-600">Product</th>
                                <th className="p-4 font-semibold text-gray-600">Type</th>
                                <th className="p-4 font-semibold text-gray-600">Quantity</th>
                                <th className="p-4 font-semibold text-gray-600">Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdjustments.map(adj => (
                                <tr key={adj._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{new Date(adj.date).toLocaleDateString()}</td>
                                    <td className="p-4">{adj.product?.name || 'Unknown Product'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${adj.type === 'add' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {adj.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4">{adj.quantity}</td>
                                    <td className="p-4">{adj.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">New Stock Adjustment</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.product}
                                    onChange={e => setFormData({ ...formData, product: e.target.value })}
                                    required
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.name} (Current: {p.stockQuantity})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full p-2 border rounded-lg"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="remove">Remove Stock</option>
                                        <option value="add">Add Stock</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full p-2 border rounded-lg"
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    required
                                >
                                    <option value="">Select Reason</option>
                                    <option value="damage">Damage</option>
                                    <option value="loss">Loss</option>
                                    <option value="expired">Expired</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Adjustments;
