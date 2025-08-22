import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, MapPin, Star, Heart, Share2 } from 'lucide-react';

interface PackageCardProps {
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
  onBookNow: () => void;
  onShare: () => void;
  onViewDetails?: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  title,
  image,
  price,
  originalPrice,
  duration,
  groupSize,
  location,
  rating,
  reviews,
  difficulty,
  highlights,
  onBookNow,
  onShare,
  onViewDetails
}) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-64 object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button>
        <button 
          onClick={onShare}
          className="absolute top-16 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Share2 className="h-5 w-5 text-gray-600 hover:text-emerald-500" />
        </button>
        {originalPrice && (
          <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Save ₹{originalPrice - price}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{title}</h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {rating} ({reviews} reviews)
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="h-4 w-4 mr-2" />
            <span>{groupSize}</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-6">
          <ul className="text-sm text-gray-600 space-y-1">
            {highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="flex items-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {/* Price and Booking */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-emerald-600">₹{price.toLocaleString()}</span>
            {originalPrice && (
              <span className="text-lg text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
            )}
            <span className="text-gray-600 text-sm">/person</span>
          </div>
          
          <div className="flex space-x-2">
            {onViewDetails && (
              <motion.button 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                onClick={onViewDetails}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View
              </motion.button>
            )}
            <motion.button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              onClick={onBookNow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;