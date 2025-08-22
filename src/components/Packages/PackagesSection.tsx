import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PackageCard from './PackageCard';
import BookingModal from '../Booking/BookingModal';
import { Filter, Search } from 'lucide-react';

const PackagesSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const packages = [
    {
      id: '1',
      title: 'Munnar Tea Garden Trek & Sunrise Experience',
      image: 'https://images.pexels.com/photos/4321306/pexels-photo-4321306.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      price: 3500,
      originalPrice: 4500,
      duration: '2 Days, 1 Night',
      groupSize: '6-12 people',
      location: 'Munnar, Idukki',
      rating: 4.8,
      reviews: 156,
      difficulty: 'Beginner' as const,
      highlights: ['Sunrise at Top Station', 'Tea plantation guided tour', 'Traditional Kerala breakfast', 'Photography sessions'],
      category: 'Trekking'
    },
    {
      id: '2',
      title: 'Wayanad Wildlife & Waterfall Adventure',
      image: 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      price: 5200,
      duration: '3 Days, 2 Nights',
      groupSize: '4-10 people',
      location: 'Wayanad',
      rating: 4.9,
      reviews: 203,
      difficulty: 'Intermediate' as const,
      highlights: ['Chembra Peak trek', 'Soochipara Falls', 'Wildlife sanctuary visit', 'Bamboo rafting'],
      category: 'Adventure'
    },
    {
      id: '3',
      title: 'Kumarakom Backwater Eco Stay Experience',
      image: 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      price: 6500,
      originalPrice: 7800,
      duration: '2 Days, 1 Night',
      groupSize: '2-8 people',
      location: 'Kumarakom, Kottayam',
      rating: 4.7,
      reviews: 89,
      difficulty: 'Beginner' as const,
      highlights: ['Traditional houseboat stay', 'Bird watching', 'Kerala cuisine cooking class', 'Village cycling tour'],
      category: 'Eco Stay'
    },
    {
      id: '4',
      title: 'Idukki Arch Dam & Hill Station Trek',
      image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      price: 4200,
      duration: '2 Days, 1 Night',
      groupSize: '8-15 people',
      location: 'Idukki',
      rating: 4.6,
      reviews: 124,
      difficulty: 'Intermediate' as const,
      highlights: ['Arch dam viewpoint', 'Hill station exploration', 'Spice plantation visit', 'Jeep safari'],
      category: 'Trekking'
    },
    {
      id: '5',
      title: 'Agasthyakoodam Peak Challenge',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      price: 8500,
      duration: '4 Days, 3 Nights',
      groupSize: '4-8 people',
      location: 'Thiruvananthapuram',
      rating: 4.9,
      reviews: 67,
      difficulty: 'Expert' as const,
      highlights: ['Second highest peak in Kerala', 'Dense forest trekking', 'Rare flora and fauna', 'Camping under stars'],
      category: 'Trekking'
    },
    {
      id: '6',
      title: 'Thekkady Spice Trail & Periyar Safari',
      image: 'https://images.pexels.com/photos/3889743/pexels-photo-3889743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      price: 4800,
      originalPrice: 5500,
      duration: '2 Days, 1 Night',
      groupSize: '6-12 people',
      location: 'Thekkady, Idukki',
      rating: 4.8,
      reviews: 198,
      difficulty: 'Beginner' as const,
      highlights: ['Periyar wildlife sanctuary', 'Spice plantation walk', 'Boat safari on Periyar Lake', 'Kathakali performance'],
      category: 'Adventure'
    }
  ];

  const filters = ['All', 'Trekking', 'Adventure', 'Eco Stay'];

  const filteredPackages = packages.filter(pkg => {
    const matchesFilter = activeFilter === 'All' || pkg.category === activeFilter;
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleBookNow = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsBookingModalOpen(true);
  };

  const handleShare = (pkg: any) => {
    if (navigator.share) {
      navigator.share({
        title: pkg.title,
        text: `Check out this amazing trekking package: ${pkg.title} - Starting from ₹${pkg.price}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `Check out this amazing trekking package: ${pkg.title} - Starting from ₹${pkg.price}\n${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      alert('Package details copied to clipboard!');
    }
  };

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
                {...pkg} 
                onBookNow={() => handleBookNow(pkg)}
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
              image: selectedPackage.image
            }}
          />
        )}
      </div>
    </section>
  );
};

export default PackagesSection;