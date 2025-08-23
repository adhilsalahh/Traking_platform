import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Eye, Package } from 'lucide-react';
import { supabase, Package as SupabasePackage, uploadPackageImage, deletePackageImage } from '../../lib/supabase';

const PackagesManagement: React.FC = () => {
  const [packages, setPackages] = useState<SupabasePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SupabasePackage | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (packageId: string, imageUrl?: string) => {
    if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) return;

    try {
      // Delete image from storage first if it exists
      if (imageUrl) {
        await deletePackageImage(imageUrl);
      }

      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', packageId);

      if (error) throw error;

      setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
      alert('Package deleted successfully');
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Error deleting package');
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Packages Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={fetchPackages}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              setSelectedPackage(null);
              setIsModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Package</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search packages by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Packages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredPackages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No packages found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPackages.map((pkg, index) => (
                  <motion.tr
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {pkg.image_url ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={pkg.image_url}
                              alt={pkg.title}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                              <Package className="h-6 w-6 text-emerald-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {pkg.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {pkg.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pkg.duration}</div>
                      <div className="text-sm text-gray-500">{pkg.group_size}</div>
                      <div className="text-sm text-gray-500 capitalize">{pkg.difficulty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-emerald-600">
                        ₹{pkg.price.toLocaleString()}
                      </div>
                      {pkg.original_price && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{pkg.original_price.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pkg.status)}`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>⭐ {pkg.rating} ({pkg.review_count} reviews)</div>
                      <div>📅 {pkg.booking_count} bookings</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setIsModalOpen(true);
                        }}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deletePackage(pkg.id, pkg.image_url)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Package Modal */}
      <PackageModal
        package={selectedPackage}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPackage(null);
        }}
        onSave={fetchPackages}
      />
    </div>
  );
};

// Package Modal Component
interface PackageModalProps {
  package: SupabasePackage | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const PackageModal: React.FC<PackageModalProps> = ({ package: pkg, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    price: 0,
    original_price: 0,
    duration: '',
    group_size: '',
    location: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Expert',
    category: '',
    highlights: [] as string[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    itinerary: [] as any[], // Added itinerary
    status: 'Draft' as 'Active' | 'Draft' | 'Inactive'
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State for image file
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pkg) {
      setFormData({
        title: pkg.title || '',
        description: pkg.description || '',
        image_url: pkg.image_url || '',
        price: pkg.price || 0,
        original_price: pkg.original_price || 0,
        duration: pkg.duration || '',
        group_size: pkg.group_size || '',
        location: pkg.location || '',
        difficulty: pkg.difficulty || 'Beginner',
        category: pkg.category || '',
        highlights: pkg.highlights || [],
        inclusions: pkg.inclusions || [],
        exclusions: pkg.exclusions || [],
        itinerary: pkg.itinerary || [], // Set itinerary from pkg
        status: pkg.status || 'Draft'
      });
      setSelectedImage(null); // Clear selected image when editing
    } else {
      setFormData({
        title: '',
        description: '',
        image_url: '',
        price: 0,
        original_price: 0,
        duration: '',
        group_size: '',
        location: '',
        difficulty: 'Beginner',
        category: '',
        highlights: [],
        inclusions: [],
        exclusions: [],
        itinerary: [],
        status: 'Draft'
      });
      setSelectedImage(null);
    }
  }, [pkg]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    } else {
      setSelectedImage(null);
    }
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'highlights' | 'inclusions' | 'exclusions') => {
    setFormData({
      ...formData,
      [field]: e.target.value.split('\n').map(item => item.trim()).filter(item => item !== '')
    });
  };

  const handleItineraryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsedItinerary = JSON.parse(e.target.value);
      setFormData({ ...formData, itinerary: parsedItinerary });
    } catch (error) {
      console.error("Invalid JSON for itinerary:", error);
      // Optionally, set an error state for the user
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // If a new image is selected, upload it
      if (selectedImage) {
        if (pkg?.image_url) {
          // Delete old image if updating and a new one is provided
          await deletePackageImage(pkg.image_url);
        }
        imageUrl = await uploadPackageImage(selectedImage, formData.title);
      } else if (!pkg?.image_url) {
        // If no image selected and no existing image for a new package, set to null
        imageUrl = '';
      }

      const packageData = {
        ...formData,
        image_url: imageUrl,
        original_price: formData.original_price || null,
        // Ensure array fields are stored as text[]
        highlights: formData.highlights,
        inclusions: formData.inclusions,
        exclusions: formData.exclusions,
        itinerary: formData.itinerary, // Ensure itinerary is stored as jsonb
      };

      if (pkg) {
        // Update existing package
        const { error } = await supabase
          .from('packages')
          .update(packageData)
          .eq('id', pkg.id);

        if (error) throw error;
        alert('Package updated successfully');
      } else {
        // Create new package
        const { error } = await supabase
          .from('packages')
          .insert([packageData]);

        if (error) throw error;
        alert('Package created successfully');
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Error saving package');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {pkg ? 'Edit Package' : 'Add New Package'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {formData.image_url && !selectedImage && (
                  <p className="text-sm text-gray-500 mt-1">Current image: <a href={formData.image_url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">View Image</a></p>
                )}
                {selectedImage && (
                  <p className="text-sm text-gray-500 mt-1">New image selected: {selectedImage.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., 2 Days, 1 Night"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Size
                </label>
                <input
                  type="text"
                  value={formData.group_size}
                  onChange={(e) => setFormData({ ...formData, group_size: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., 6-12 people"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Trekking, Adventure"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Highlights (one per line)
                </label>
                <textarea
                  value={formData.highlights.join('\n')}
                  onChange={(e) => handleArrayChange(e, 'highlights')}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inclusions (one per line)
                </label>
                <textarea
                  value={formData.inclusions.join('\n')}
                  onChange={(e) => handleArrayChange(e, 'inclusions')}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exclusions (one per line)
                </label>
                <textarea
                  value={formData.exclusions.join('\n')}
                  onChange={(e) => handleArrayChange(e, 'exclusions')}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Itinerary (JSON format)
                </label>
                <textarea
                  value={JSON.stringify(formData.itinerary, null, 2)}
                  onChange={handleItineraryChange}
                  rows={5}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={`[\n  {\n    "day": "Day 1",\n    "title": "Arrival & Setup",\n    "activities": ["Check-in", "Briefing"],\n    "time": "2:00 PM"\n  }\n]`}
                />
                <p className="text-xs text-gray-500 mt-1">Enter itinerary as a JSON array of objects. Each object should have 'day', 'title', 'activities' (array of strings), and 'time' properties.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : pkg ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PackagesManagement;
