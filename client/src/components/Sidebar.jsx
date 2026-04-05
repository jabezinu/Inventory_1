import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Truck,
    Users,
    BarChart,
    Layers,
    FileText
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/products', label: 'Products', icon: Package },
        { path: '/sales', label: 'Sales', icon: ShoppingCart },
        { path: '/purchases', label: 'Purchases', icon: Truck },
        { path: '/categories', label: 'Categories', icon: Layers },
        { path: '/suppliers', label: 'Suppliers', icon: Users },
        { path: '/customers', label: 'Customers', icon: Users },
        { path: '/reports', label: 'Reports', icon: BarChart },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-400">InventorySystem</h1>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <p className="text-xs text-center text-gray-500">v1.0.0</p>
            </div>
        </div>
    );
};

export default Sidebar;
