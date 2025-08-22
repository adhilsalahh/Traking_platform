import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Wifi, Car, Coffee, Users, Star, Calendar } from 'lucide-react';

const EcoStaysSection: React.FC = () => {
  const ecoStays = [
    {
      id: 1,
      name: 'Bamboo Grove Eco Resort',
      location: 'Wayanad',
      image: 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      price: 4500,
      originalPrice: 5500,
      rating: 4.8,
      reviews: 124,
      amenities: ['Free WiFi', 'Organic Meals', 'Nature Walks', 'Bird Watching'],
      features: ['100% Solar Powered', 'Rainwater Harvesting', 'Organic Farming', 'Zero Waste'],
      description: 'Experience sustainable luxury amidst bamboo groves and pristine forests.'
    },
    {
      id: 2,
      name: 'Treehouse Sanctuary',
      location: 'Munnar',
      image: 'https://images.pexels.com/photos/3889743/pexels-photo-3889743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      price: 6200,
      rating: 4.9,
      reviews: 89,
      amenities: ['Tree Top View', 'Organic Garden', 'Yoga Sessions', 'Meditation'],
      features: ['Elevated Design', 'Minimal Impact', 'Local Materials', 'Wildlife Viewing'],
      description: 'Sleep among the treetops in our eco-friendly elevated accommodations.'
    },
    {
      id: 3,
      name: 'Lake View Eco Lodge',
      location: 'Kumarakom',
      image: 'https://images.pexels.com/photos/4321306/pexels-photo-4321306.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      price: 5800,
      originalPrice: 7000,
      rating: 4.7,
      reviews: 156,
      amenities: ['Lake Access', 'Kayaking', 'Fishing', 'Sunset Views'],
      features: ['Water Conservation', 'Local Community Support', 'Sustainable Fishing', 'Eco Tours'],
      description: 'Waterfront eco-lodge offering serene lake views and sustainable experiences.'
    },
    {
      id: 4,
      name: 'Mountain Mist Retreat',
      location: 'Thekkady',
      image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      price: 3800,
      rating: 4.6,
      reviews: 98,
      amenities: ['Mountain Views', 'Spice Garden', 'Ayurveda Spa', 'Trekking Guides'],
      features: ['Herbal Gardens', 'Traditional Architecture', 'Local Artisans', 'Eco Education'],
      description: 'Mountain retreat focused on wellness and connection with nature.'
    }
  ];

  return (
    <section id="eco-stays" className="py-20 bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sustainable <span className="text-emerald-600">Eco Stays</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay in harmony with nature at our carefully selected eco-friendly accommodations. 
            Experience comfort while preserving Kerala's pristine environment.
          </p>
        </motion.div>

        {/* Eco Benefits */}
        <motion.div 
          className="flex flex-wrap justify-center gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <span className="text-gray-700 font-medium">100% Eco-Friendly</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <Users className="h-5 w-5 text-emerald-600" />
            <span className="text-gray-700 font-medium">Community Supported</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
            <Star className="h-5 w-5 text-emerald-600" />
            <span className="text-gray-700 font-medium">Premium Experience</span>
          </div>
        </motion.div>

        {/* Eco Stays Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ecoStays.map((stay, index) => (
            <motion.div
              key={stay.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={stay.image} 
                  alt={stay.name}
                  className="w-full h-64 object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Leaf className="h-4 w-4" />
                  <span>Eco Certified</span>
                </div>
                {stay.originalPrice && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Save ₹{stay.originalPrice - stay.price}
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{stay.name}</h3>
                    <p className="text-gray-600 flex items-center">
                      <span>{stay.location}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">
                      {stay.rating} ({stay.reviews})
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{stay.description}</p>

                {/* Eco Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Eco Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {stay.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Amenities:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {stay.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and Booking */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-emerald-600">₹{stay.price.toLocaleString()}</span>
                    {stay.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">₹{stay.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="text-gray-600 text-sm">/night</span>
                  </div>
                  
                  <motion.button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    onClick={() => alert('Booking system integrated! This would open the booking modal.')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book Stay
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <Leaf className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Experience Sustainable Tourism
            </h3>
            <p className="text-gray-600 mb-6">
              Join us in preserving Kerala's natural beauty while enjoying world-class hospitality. 
              Every stay contributes to local communities and environmental conservation.
            </p>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Learn More About Our Eco Initiative
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EcoStaysSection;