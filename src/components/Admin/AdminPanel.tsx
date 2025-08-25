import React, { useState, useEffect, useMemo } from 'react';
import { Settings, Users, Calendar, BarChart3, Package, MapPin } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import BookingsManagement from './BookingsManagement';
import UsersManagement from './UsersManagement';
import PackagesManagement from './PackagesManagement';
import TrailsManagement from './TrailsManagement';
import AdminSettings from './AdminSettings';
import ProtectedRoute from './ProtectedRoute';

interface AdminPanelProps {
  onClose?: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'trails', label: 'Trails', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'bookings':
        return <BookingsManagement />;
      case 'users':
        return <UsersManagement />;
      case 'packages':
        return <PackagesManagement />;
      case 'trails':
        return <TrailsManagement />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  }, [activeTab]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-sm text-gray-600 mt-1">Kerala Trekking Management</p>
            </div>
            <nav className="mt-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600'
                        : 'text-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
            
            {/* Admin Actions */}
            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Back to Website
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {renderContent}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}