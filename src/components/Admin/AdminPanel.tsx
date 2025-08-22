import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Package, 
  Users, 
  Settings, 
  Bell, 
  CreditCard, 
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  Save,
  X
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [showAddPackage, setShowAddPackage] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'bookings', label: 'Bookings', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Total Bookings', value: '1,247', change: '+12%', color: 'text-emerald-600' },
    { label: 'Revenue', value: '₹8,45,230', change: '+18%', color: 'text-blue-600' },
    { label: 'Active Users', value: '892', change: '+7%', color: 'text-orange-600' },
    { label: 'Packages', value: '28', change: '+2', color: 'text-purple-600' },
  ];

  const recentBookings = [
    { id: 'BK001', user: 'Rahul Sharma', package: 'Munnar Trek', amount: '₹3,500', status: 'Confirmed', date: '2025-01-15' },
    { id: 'BK002', user: 'Priya Nair', package: 'Wayanad Adventure', amount: '₹5,200', status: 'Pending', date: '2025-01-15' },
    { id: 'BK003', user: 'Arjun Kumar', package: 'Kumarakom Eco Stay', amount: '₹6,500', status: 'Confirmed', date: '2025-01-14' },
    { id: 'BK004', user: 'Sneha Menon', package: 'Thekkady Safari', amount: '₹4,800', status: 'Confirmed', date: '2025-01-14' },
  ];

  const packages = [
    { 
      id: 1, 
      name: 'Munnar Tea Garden Trek', 
      price: 3500, 
      bookings: 45, 
      status: 'Active',
      image: 'https://images.pexels.com/photos/4321306/pexels-photo-4321306.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      duration: '2 Days, 1 Night',
      location: 'Munnar, Idukki',
      description: 'Experience the beauty of tea gardens with sunrise views',
      highlights: ['Sunrise at Top Station', 'Tea plantation tour', 'Traditional breakfast']
    },
    { 
      id: 2, 
      name: 'Wayanad Wildlife Adventure', 
      price: 5200, 
      bookings: 32, 
      status: 'Active',
      image: 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      duration: '3 Days, 2 Nights',
      location: 'Wayanad',
      description: 'Wildlife safari and waterfall adventure',
      highlights: ['Chembra Peak trek', 'Soochipara Falls', 'Wildlife sanctuary']
    },
    { 
      id: 3, 
      name: 'Kumarakom Eco Stay', 
      price: 6500, 
      bookings: 28, 
      status: 'Active',
      image: 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      duration: '2 Days, 1 Night',
      location: 'Kumarakom',
      description: 'Backwater experience with eco-friendly stay',
      highlights: ['Houseboat stay', 'Bird watching', 'Cooking class']
    },
    { 
      id: 4, 
      name: 'Agasthyakoodam Challenge', 
      price: 8500, 
      bookings: 15, 
      status: 'Draft',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      duration: '4 Days, 3 Nights',
      location: 'Thiruvananthapuram',
      description: 'Challenging trek to second highest peak',
      highlights: ['Dense forest trekking', 'Rare flora and fauna', 'Camping under stars']
    },
  ];

  const [packagesData, setPackagesData] = useState(packages);

  const handleEditPackage = (pkg: any) => {
    setEditingPackage({ ...pkg });
  };

  const handleSavePackage = () => {
    if (editingPackage) {
      setPackagesData(prev => 
        prev.map(pkg => pkg.id === editingPackage.id ? editingPackage : pkg)
      );
      setEditingPackage(null);
      alert('Package updated successfully!');
    }
  };

  const handleAddPackage = () => {
    setShowAddPackage(true);
    setEditingPackage({
      id: Date.now(),
      name: '',
      price: 0,
      bookings: 0,
      status: 'Draft',
      image: '',
      duration: '',
      location: '',
      description: '',
      highlights: ['']
    });
  };

  const confirmBooking = (bookingId: string) => {
    // Simulate sending confirmation to customer
    alert(`Booking ${bookingId} confirmed! 
    
    ✅ Confirmation email sent to customer
    ✅ WhatsApp confirmation sent
    ✅ Booking status updated to "Confirmed"`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`text-sm font-medium ${stat.color}`}>
                      {stat.change}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Recent Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.package}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'Confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'packages':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Packages</h2>
              <button 
                onClick={handleAddPackage}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Package</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {packagesData.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {pkg.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img src={pkg.image} alt={pkg.name} className="w-16 h-12 object-cover rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{pkg.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pkg.bookings}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            pkg.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {pkg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEditPackage(pkg)}
                              className="text-emerald-600 hover:text-emerald-800">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Package Edit Modal */}
            {editingPackage && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        {showAddPackage ? 'Add New Package' : 'Edit Package'}
                      </h3>
                      <button
                        onClick={() => {
                          setEditingPackage(null);
                          setShowAddPackage(false);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                        <input
                          type="text"
                          value={editingPackage.name}
                          onChange={(e) => setEditingPackage({...editingPackage, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                          <input
                            type="number"
                            value={editingPackage.price}
                            onChange={(e) => setEditingPackage({...editingPackage, price: parseInt(e.target.value)})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                          <input
                            type="text"
                            value={editingPackage.duration}
                            onChange={(e) => setEditingPackage({...editingPackage, duration: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={editingPackage.location}
                          onChange={(e) => setEditingPackage({...editingPackage, location: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <div className="flex space-x-2">
                          <input
                            type="url"
                            value={editingPackage.image}
                            onChange={(e) => setEditingPackage({...editingPackage, image: e.target.value})}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            placeholder="https://example.com/image.jpg"
                          />
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
                            <Upload className="h-4 w-4" />
                            <span>Upload</span>
                          </button>
                        </div>
                        {editingPackage.image && (
                          <img src={editingPackage.image} alt="Preview" className="mt-2 w-32 h-24 object-cover rounded" />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={editingPackage.description}
                          onChange={(e) => setEditingPackage({...editingPackage, description: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                        {editingPackage.highlights.map((highlight: string, index: number) => (
                          <div key={index} className="flex space-x-2 mb-2">
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => {
                                const newHighlights = [...editingPackage.highlights];
                                newHighlights[index] = e.target.value;
                                setEditingPackage({...editingPackage, highlights: newHighlights});
                              }}
                              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                              placeholder="Package highlight"
                            />
                            <button
                              onClick={() => {
                                const newHighlights = editingPackage.highlights.filter((_: any, i: number) => i !== index);
                                setEditingPackage({...editingPackage, highlights: newHighlights});
                              }}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setEditingPackage({...editingPackage, highlights: [...editingPackage.highlights, '']})}
                          className="text-emerald-600 hover:text-emerald-700 text-sm"
                        >
                          + Add Highlight
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={editingPackage.status}
                          onChange={(e) => setEditingPackage({...editingPackage, status: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="Active">Active</option>
                          <option value="Draft">Draft</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        onClick={() => {
                          setEditingPackage(null);
                          setShowAddPackage(false);
                        }}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePackage}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>{showAddPackage ? 'Add Package' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Bookings</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.package}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'Confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.status === 'Pending' && (
                            <button
                              onClick={() => confirmBooking(booking.id)}
                              className="bg-emerald-600 text-white px-3 py-1 rounded text-xs hover:bg-emerald-700"
                            >
                              Confirm
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <div className="text-xl font-bold text-emerald-600">
              Admin <span className="text-gray-900">Panel</span>
            </div>
          </div>
          
          <nav className="mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                    activeTab === item.id 
                      ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;