import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mountain, Clock, TrendingUp, Users } from 'lucide-react';
import BookingModal from '../Booking/BookingModal';
import TrailDetailsModal from './TrailDetailsModal';

const TrailsSection: React.FC = () => {
  const [selectedTrail, setSelectedTrail] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const trails = [
    {
      id: 1,
      name: 'Anamudi Peak Trail',
      difficulty: 'Expert',
      duration: '6-8 hours',
      elevation: '2,695m',
      image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'The highest peak in South India offers breathtaking panoramic views.',
      features: ['Highest peak in South India', 'Rare Neelakurinji flowers', 'Shola forests', 'Wildlife spotting'],
      difficultyColor: 'bg-red-100 text-red-800'
    },
    {
      id: 2,
      name: 'Chembra Peak Circuit',
      difficulty: 'Intermediate',
      duration: '4-5 hours',
      elevation: '2,100m',
      image: 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'Famous for its heart-shaped lake and stunning valley views.',
      features: ['Heart-shaped lake', 'Valley views', 'Tea plantations', 'Cool climate'],
      difficultyColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 3,
      name: 'Meesapulimala Trek',
      difficulty: 'Intermediate',
      duration: '5-6 hours',
      elevation: '2,640m',
      image: 'https://images.pexels.com/photos/4321306/pexels-photo-4321306.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'Second highest peak with rolling grasslands and mist-covered valleys.',
      features: ['Rolling grasslands', 'Mist-covered valleys', '360-degree views', 'Sunrise point'],
      difficultyColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 4,
      name: 'Ponmudi Hills Walk',
      difficulty: 'Beginner',
      duration: '2-3 hours',
      elevation: '1,100m',
      image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'Gentle trails through lush green forests and golden grasslands.',
      features: ['Lush forests', 'Golden grasslands', 'Waterfalls', 'Easy accessibility'],
      difficultyColor: 'bg-green-100 text-green-800'
    },
    {
      id: 5,
      name: 'Vagamon Meadows Trail',
      difficulty: 'Beginner',
      duration: '3-4 hours',
      elevation: '1,200m',
      image: 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'Gentle rolling hills with pine forests and meadows.',
      features: ['Pine forests', 'Rolling meadows', 'Cool climate', 'Perfect for families'],
      difficultyColor: 'bg-green-100 text-green-800'
    },
    {
      id: 6,
      name: 'Kurinjimala Sanctuary Trek',
      difficulty: 'Expert',
      duration: '7-8 hours',
      elevation: '2,019m',
      image: 'https://images.pexels.com/photos/3889743/pexels-photo-3889743.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'Challenging trek through protected wildlife sanctuary.',
      features: ['Wildlife sanctuary', 'Rare flora and fauna', 'Neelakurinji blooms', 'Permit required'],
      difficultyColor: 'bg-red-100 text-red-800'
    }
  ];

  const handleBookNow = (trail: any) => {
    setSelectedTrail(trail);
    setIsBookingModalOpen(true);
  };

  const handleViewDetails = (trail: any) => {
    setSelectedTrail(trail);
    setIsDetailsModalOpen(true);
  };

  return (
    <>
      <section id="trails" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover <span className="text-emerald-600">Trekking Trails</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From gentle hill walks for beginners to challenging peak ascents for experts, 
            explore Kerala's diverse trekking trails suited for every adventure level.
          </p>
        </motion.div>

        {/* Difficulty Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-800 font-medium">Beginner</span>
          </div>
          <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-800 font-medium">Intermediate</span>
          </div>
          <div className="flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-800 font-medium">Expert</span>
          </div>
        </div>

        {/* Trails Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trails.map((trail, index) => (
            <motion.div
              key={trail.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={trail.image} 
                  alt={trail.name}
                  className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${trail.difficultyColor}`}>
                    {trail.difficulty}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-gray-800 font-semibold flex items-center">
                    <Mountain className="h-4 w-4 mr-1" />
                    {trail.elevation}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{trail.name}</h3>
                <p className="text-gray-600 mb-4">{trail.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{trail.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">{trail.elevation}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Trail Highlights:</h4>
                  <ul className="space-y-1">
                    {trail.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <motion.button 
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    onClick={() => handleViewDetails(trail)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                  </motion.button>
                  <motion.button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    onClick={() => handleBookNow(trail)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </section>

      {/* Trail Details Modal */}
      {selectedTrail && (
        <TrailDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedTrail(null);
          }}
          onBookNow={() => {
            setIsDetailsModalOpen(false);
            setIsBookingModalOpen(true);
          }}
          trailData={selectedTrail}
        />
      )}

      {/* Booking Modal */}
      {selectedTrail && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedTrail(null);
          }}
          packageData={{
            id: selectedTrail.id.toString(),
            title: selectedTrail.name,
            price: 2500, // Default trail price
            duration: selectedTrail.duration,
            location: selectedTrail.location,
            image: selectedTrail.image
          }}
          bookingType="trail"
        />
      )}
    </>
  );
};

export default TrailsSection;