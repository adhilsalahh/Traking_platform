import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PackageCard from './PackageCard';
import BookingModal from '../Booking/BookingModal';
import PackageDetailsModal from './PackageDetailsModal';
import { Filter, Search } from 'lucide-react';
import { getPackages, Package as SupabasePackage } from '../../lib/supabase'; // Import getPackages and the Package type

const PackagesSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<SupabasePackage | null>(null); 
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [packages, setPackages] = useState<SupabasePackage[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackagesData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await getPackages();
        if (error) {
          throw new Error(error.message || 'Failed to fetch packages');
        }
        setPackages(data || []);
      } catch (err) {
        console.error('Error fetching packages:', err);
        // Fallback to mock data when Supabase is not configured
        const mockPackages = [
          {
            id: 'mock-1',
            title: 'Munnar Tea Garden Trek & Sunrise Experience',
            description: 'Experience the misty mountains and tea plantations of Munnar',
            image_url: 'https://images.pexels.com/photos/4321306/pexels-photo-4321306.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
            price: 3500,
            original_price: 4500,
            duration: '2 Days, 1 Night',
            group_size: '6-12 people',
            location: 'Munnar, Idukki',
            difficulty: 'Beginner' as const,
            category: 'Trekking',
            highlights: ['Sunrise at Top Station', 'Tea plantation guided tour', 'Traditional Kerala breakfast', 'Photography sessions'],
            inclusions: ['Professional trek guide', 'All meals during trek', 'Accommodation', 'Safety equipment'],
            exclusions: ['Personal trekking gear', 'Travel insurance', 'Personal expenses'],
            itinerary: [],
            rating: 4.8,
            review_count: 124,
            booking_count: 45,
            status: 'Active' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'mock-2',
            title: 'Wayanad Wildlife & Waterfall Adventure',
            description: 'Wildlife safari and waterfall adventure with challenging treks',
            image_url: 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
            price: 5200,
            original_price: undefined,
            duration: '3 Days, 2 Nights',
            group_size: '4-10 people',
            location: 'Wayanad',
            difficulty: 'Intermediate' as const,
            category: 'Adventure',
            highlights: ['Chembra Peak trek', 'Soochipara Falls', 'Wildlife sanctuary visit', 'Bamboo rafting'],
            inclusions: ['Professional trek guide', 'All meals during trek', 'Accommodation', 'Safety equipment'],
            exclusions: ['Personal trekking gear', 'Travel insurance', 'Personal expenses'],
            itinerary: [],
            rating: 4.9,
            review_count: 89,
            booking_count: 32,
            status: 'Active' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setPackages(mockPackages);
        setError('Using demo data - Supabase not configured');
      }
      setLoading(false);
    };

    fetchPackagesData();
  }, []);

  const filters = ['All', 'Trekking', 'Adventure', 'Eco Stay'];

  const filteredPackages = packages.filter(pkg => {
    const matchesFilter = activeFilter === 'All' || pkg.category === activeFilter;
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleBookNow = (pkg: SupabasePackage) => {
    setSelectedPackage(pkg);
    setIsBookingModalOpen(true);
  };

  const handleViewDetails = (pkg: SupabasePackage) => {
    setSelectedPackage(pkg);
    setIsDetailsModalOpen(true);
  };

  const handleShare = (pkg: SupabasePackage) => {
    if (navigator.share) {
      navigator.share({
        title: pkg.title,
        text: `Check out this amazing trekking package: ${pkg.title} - Starting from ₹${pkg.price}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `Check out this amazing trekking package: ${pkg.title} - Starting from ₹${pkg.price}\n${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      alert('Package details copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <section id="packages" className="py-20 bg-gray-50 text-center">
        <p className="text-gray-600 text-lg">Loading packages...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="packages" className="py-20 bg-gray-50 text-center">
        <p className="text-red-600 text-lg">{error}</p>
      </section>
    );
  }

  return (
    <section id="packages" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Adventure <span className="text-emerald-600">Packages</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our carefully curated collection of trekking adventures, 
            eco-stays, and nature experiences across Kerala's most stunning landscapes.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <div className="flex space-x-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PackageCard 
                id={pkg.id}
                title={pkg.title} 
                image={pkg.image_url || 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'} 
                price={pkg.price}
                originalPrice={pkg.original_price || undefined}
                duration={pkg.duration}
                groupSize={pkg.group_size}
                location={pkg.location}
                rating={pkg.rating || 0}
                reviews={pkg.review_count || 0}
                difficulty={pkg.difficulty as 'Beginner' | 'Intermediate' | 'Expert'}
                highlights={pkg.highlights || []}
                onBookNow={() => handleBookNow(pkg)}
                onViewDetails={() => handleViewDetails(pkg)}
                onShare={() => handleShare(pkg)}
              />
            </motion.div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No packages found matching your criteria.</p>
          </div>
        )}

        {/* Package Details Modal */}
        {selectedPackage && (
          <PackageDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedPackage(null);
            }}
            onBookNow={() => {
              setIsDetailsModalOpen(false);
              setIsBookingModalOpen(true);
            }}
            packageData={{
              id: selectedPackage.id,
              title: selectedPackage.title,
              image: selectedPackage.image_url || 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
              price: selectedPackage.price,
              originalPrice: selectedPackage.original_price || undefined,
              duration: selectedPackage.duration,
              groupSize: selectedPackage.group_size,
              location: selectedPackage.location,
              rating: selectedPackage.rating || 0,
              reviews: selectedPackage.review_count || 0,
              difficulty: selectedPackage.difficulty as 'Beginner' | 'Intermediate' | 'Expert',
              highlights: selectedPackage.highlights || [],
              category: selectedPackage.category
            }}
          />
        )}

        {/* Booking Modal */}
        {selectedPackage && (
          <BookingModal
            isOpen={isBookingModalOpen}
            onClose={() => {
              setIsBookingModalOpen(false);
              setSelectedPackage(null);
            }}
            packageData={{
              id: selectedPackage.id,
              title: selectedPackage.title,
              price: selectedPackage.price,
              duration: selectedPackage.duration,
              location: selectedPackage.location,
              image: selectedPackage.image_url || 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
            }}
          />
        )}
      </div>
    </section>
  );
};

export default PackagesSection;
