import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Package, 
  MapPin, 
  TrendingUp, 
  DollarSign,
  Activity
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalBookings: number;
  totalUsers: number;
  totalPackages: number;
  totalTrails: number;
  totalRevenue: number;
  pendingBookings: number;
  activePackages: number;
  recentBookings: any[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalUsers: 0,
    totalPackages: 0,
    totalTrails: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    activePackages: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [
        bookingsResult,
        usersResult,
        packagesResult,
        trailsResult,
        recentBookingsResult
      ] = await Promise.all([
        supabase.from('bookings').select('total_amount, status'),
        supabase.from('users').select('id'),
        supabase.from('packages').select('status'),
        supabase.from('trails').select('status'),
        supabase
          .from('bookings')
          .select(`
            *,
            users (full_name, email),
            packages (title),
            trails (name),
            eco_stays (name)
          `)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const bookings = bookingsResult.data || [];
      const users = usersResult.data || [];
      const packages = packagesResult.data || [];
      const trails = trailsResult.data || [];
      const recentBookings = recentBookingsResult.data || [];

      const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
      const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
      const activePackages = packages.filter(p => p.status === 'Active').length;

      setStats({
        totalBookings: bookings.length,
        totalUsers: users.length,
        totalPackages: packages.length,
        totalTrails: trails.length,
        totalRevenue,
        pendingBookings,
        activePackages,
        recentBookings
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Active Packages',
      value: stats.activePackages,
      icon: Package,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Trails',
      value: stats.totalTrails,
      icon: MapPin,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Activity,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <button
          onClick={fetchDashboardStats}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className={`${stat.bgColor} p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${stat.textColor} text-sm font-medium`}>{stat.title}</p>
                  <p className={`${stat.textColor} text-2xl font-bold mt-1`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
        </div>
        <div className="p-6">
          {stats.recentBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent bookings found</p>
          ) : (
            <div className="space-y-4">
              {stats.recentBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.users?.full_name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.packages?.title || booking.trails?.name || booking.eco_stays?.name || 'Unknown Item'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">
                      ₹{booking.total_amount?.toLocaleString()}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;