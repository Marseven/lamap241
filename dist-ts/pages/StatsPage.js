import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import StatsDashboard from '../components/StatsDashboard';
import EnhancedLeaderboard from '../components/EnhancedLeaderboard';
import { ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';
const StatsPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const tabs = [
        {
            id: 'dashboard',
            name: 'Mon Dashboard',
            icon: ChartBarIcon,
            component: StatsDashboard
        },
        {
            id: 'leaderboards',
            name: 'Classements',
            icon: TrophyIcon,
            component: EnhancedLeaderboard
        }
    ];
    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "flex space-x-8", children: tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Icon, { className: "h-5 w-5 mr-2" }), tab.name] }, tab.id));
                        }) }) }) }), _jsx("div", { className: "py-8", children: ActiveComponent && _jsx(ActiveComponent, {}) })] }));
};
export default StatsPage;
