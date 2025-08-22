import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, TrendingUp, MapPin, Mountain, Users, Star } from 'lucide-react';

interface TrailDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
  trailData: {
    id: number;
    name: string;
    image: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Expert';
    duration: string;
    elevation: string;
    location: string;
    description: string;
    features: string[];
    difficultyColor: string;
  };
}

const TrailDetailsModal: React.FC<TrailDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  onBookNow, 
  trailData 
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

  const trailPrice = 2500; // Default trail price

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
            src={trailData.image} 
            alt={trailData.name}
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
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(trailData.difficulty)}`}>
              {trailData.difficulty}
            </span>
          </div>
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-gray-800 font-semibold flex items-center">
              <Mountain className="h-4 w-4 mr-1" />
              {trailData.elevation}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Title and Info */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{trailData.name}</h2>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{trailData.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>{trailData.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>{trailData.elevation}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About This Trail</h3>
            <p className="text-gray-700 leading-relaxed">{trailData.description}</p>
          </div>

          {/* Trail Features */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Trail Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trailData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Professional trail guide',
                'Safety equipment',
                'First aid kit',
                'Trail map and compass',
                'Emergency communication device',
                'Basic refreshments'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Information */}
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Safety Requirements</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Minimum age: 16 years (with adult supervision)</li>
              <li>• Good physical fitness required</li>
              <li>• Weather-appropriate clothing mandatory</li>
              <li>• Follow guide instructions at all times</li>
            </ul>
          </div>

          {/* Price and Booking */}
          <div className="bg-emerald-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-3xl font-bold text-emerald-600">₹{trailPrice.toLocaleString()}</span>
                  <span className="text-gray-600">/person</span>
                </div>
                <p className="text-sm text-gray-600">Includes guide, safety equipment & refreshments</p>
              </div>
              
              <motion.button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                onClick={onBookNow}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book This Trail
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrailDetailsModal;