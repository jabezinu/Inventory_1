import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { getPurchases, createPurchase } from '../services/purchaseService';
import { getProducts } from '../services/productService';
import { getSuppliers } from '../services/supplierService';

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        product: '',
        quantity: 1,
        costPrice: 0,
        supplier: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [purchasesData, productsData, suppliersData] = await Promise.all([
                getPurchases(),
                getProducts(),
                getSuppliers()
            ]);
            setPurchases(purchasesData);
            setProducts(productsData);
            setSuppliers(suppliersData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPurchase(formData);
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error("Error creating purchase:", error);
            alert("Error creating purchase: " + (error.response?.data?.error || error.message));
        }
    };

    const resetForm = () => {
        setFormData({
            product: '',
            quantity: 1,
            costPrice: 0,
            supplier: ''
        });
    };

    const filteredPurchases = purchases.filter(purchase =>
        purchase.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center">Loading Purchases...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Purchases</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Record Purchase
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search purchases..."
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
                                <th className="p-4 font-semibold text-gray-600">Supplier</th>
                                <th className="p-4 font-semibold text-gray-600">Quantity</th>
                                <th className="p-4 font-semibold text-gray-600">Unit Cost</th>
                                <th className="p-4 font-semibold text-gray-600">Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPurchases.map(purchase => (
                                <tr key={purchase._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{new Date(purchase.date).toLocaleDateString()}</td>
                                    <td className="p-4">{purchase.product?.name || 'Unknown Product'}</td>
                                    <td className="p-4">{purchase.supplier?.name || 'Unknown Supplier'}</td>
                                    <td className="p-4">{purchase.quantity}</td>
                                    <td className="p-4">${purchase.costPrice}</td>
                                    <td className="p-4 font-medium">${(purchase.costPrice * purchase.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Record Purchase</h2>

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
                                            {p.name} (Current Stock: {p.stockQuantity})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.supplier}
                                    onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                                    required
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers.map(s => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full p-2 border rounded-lg"
                                        value={formData.costPrice}
                                        onChange={e => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                                        required
                                    />
                                </div>
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
                                    Confirm Purchase
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Purchases;
