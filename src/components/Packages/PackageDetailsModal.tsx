import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Users, MapPin, Star, Calendar, Camera, Utensils, Shield, Award } from 'lucide-react';

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
  packageData: {
    id: string;
    title: string;
    image: string;
    price: number;
    originalPrice?: number;
    duration: string;
    groupSize: string;
    location: string;
    rating: number;
    reviews: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Expert';
    highlights: string[];
    category: string;
  };
}

const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  onBookNow, 
  packageData 
}) => {
  if (!isOpen) return null;

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const itinerary = [
    {
      day: 'Day 1',
      title: 'Arrival & Base Camp Setup',
      activities: ['Check-in at base camp', 'Welcome briefing', 'Equipment check', 'Evening tea with local snacks'],
      time: '2:00 PM - 8:00 PM'
    },
    {
      day: 'Day 2',
      title: 'Main Trek & Exploration',
      activities: ['Early morning start', 'Guided trek to main destination', 'Photography sessions', 'Traditional lunch'],
      time: '6:00 AM - 6:00 PM'
    },
    {
      day: 'Day 3',
      title: 'Sunrise & Departure',
      activities: ['Sunrise viewing', 'Breakfast', 'Return journey', 'Certificate presentation'],
      time: '5:30 AM - 12:00 PM'
    }
  ];

  const inclusions = [
    'Professional trek guide',
    'All meals during trek',
    'Accommodation (if overnight)',
    'Safety equipment',
    'First aid kit',
    'Photography assistance',
    'Certificate of completion',
    'Transportation from meeting point'
  ];

  const exclusions = [
    'Personal trekking gear',
    'Travel insurance',
    'Personal expenses',
    'Tips for guides',
    'Emergency evacuation',
    'Alcoholic beverages'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header Image */}
        <div className="relative h-64 overflow-hidden rounded-t-2xl">
          <img 
            src={packageData.image} 
            alt={packageData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm text-gray-800 rounded-full hover:bg-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(packageData.difficulty)}`}>
              {packageData.difficulty}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Title and Rating */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{packageData.title}</h2>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(packageData.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {packageData.rating} ({packageData.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{packageData.location}</span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{packageData.duration}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">Group Size</p>
                <p className="font-semibold">{packageData.groupSize}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold">{packageData.category}</p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Package Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {packageData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Itinerary</h3>
            <div className="space-y-4">
              {itinerary.map((day, index) => (
                <motion.div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{day.day}: {day.title}</h4>
                    <span className="text-sm text-gray-500">{day.time}</span>
                  </div>
                  <ul className="space-y-1">
                    {day.activities.map((activity, actIndex) => (
                      <li key={actIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></div>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                What's Included
              </h3>
              <ul className="space-y-2">
                {inclusions.map((item, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <X className="h-5 w-5 text-red-600 mr-2" />
                What's Not Included
              </h3>
              <ul className="space-y-2">
                {exclusions.map((item, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Gallery Preview */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Camera className="h-5 w-5 text-emerald-600 mr-2" />
              Photo Gallery
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={`https://images.pexels.com/photos/${2662116 + index}/pexels-photo-${2662116 + index}.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop`}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Price and Booking */}
          <div className="bg-emerald-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-3xl font-bold text-emerald-600">₹{packageData.price.toLocaleString()}</span>
                  {packageData.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">₹{packageData.originalPrice.toLocaleString()}</span>
                  )}
                  <span className="text-gray-600">/person</span>
                </div>
                <p className="text-sm text-gray-600">All inclusive pricing • No hidden charges</p>
              </div>
              
              <motion.button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                onClick={onBookNow}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book This Adventure
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PackageDetailsModal;