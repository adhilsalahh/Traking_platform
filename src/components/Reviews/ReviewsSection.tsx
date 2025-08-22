import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ThumbsUp, MessageCircle, User } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  date: string;
  packageName: string;
  review: string;
  helpful: number;
  verified: boolean;
}

const ReviewsSection: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const reviews: Review[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      rating: 5,
      date: '2025-01-10',
      packageName: 'Munnar Tea Garden Trek',
      review: 'Absolutely incredible experience! The guides were knowledgeable, the views were breathtaking, and the tea plantation tour was fascinating. Perfect for beginners like me. The sunrise at Top Station was unforgettable!',
      helpful: 24,
      verified: true
    },
    {
      id: '2',
      name: 'Priya Nair',
      rating: 5,
      date: '2025-01-08',
      packageName: 'Wayanad Wildlife Adventure',
      review: 'This was my first trekking experience and it exceeded all expectations. The Chembra Peak trek was challenging but rewarding. Soochipara Falls was magical! Great organization and safety measures.',
      helpful: 18,
      verified: true
    },
    {
      id: '3',
      name: 'Arjun Kumar',
      rating: 4,
      date: '2025-01-05',
      packageName: 'Kumarakom Eco Stay',
      review: 'Peaceful and rejuvenating experience. The houseboat stay was comfortable and the bird watching was amazing. The cooking class was a nice touch. Only wish it was longer!',
      helpful: 15,
      verified: true
    },
    {
      id: '4',
      name: 'Sneha Menon',
      rating: 5,
      date: '2025-01-03',
      packageName: 'Thekkady Spice Trail',
      review: 'Perfect blend of adventure and culture. The spice plantation walk was educational and the Periyar safari was exciting. Saw elephants up close! Highly recommend for families.',
      helpful: 21,
      verified: true
    },
    {
      id: '5',
      name: 'Vikram Singh',
      rating: 5,
      date: '2024-12-28',
      packageName: 'Agasthyakoodam Challenge',
      review: 'Challenging trek for experienced hikers. The dense forest sections were incredible and camping under the stars was magical. Guides were excellent and safety was top priority.',
      helpful: 12,
      verified: true
    },
    {
      id: '6',
      name: 'Meera Krishnan',
      rating: 4,
      date: '2024-12-25',
      packageName: 'Idukki Hill Station Trek',
      review: 'Beautiful landscapes and well-organized trek. The arch dam viewpoint was spectacular. The jeep safari was thrilling. Great value for money and professional service.',
      helpful: 9,
      verified: true
    }
  ];

  const filteredReviews = selectedRating 
    ? reviews.filter(review => review.rating === selectedRating)
    : reviews;

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: (reviews.filter(review => review.rating === rating).length / reviews.length) * 100
  }));

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-emerald-600">Adventurers</span> Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real experiences from real trekkers. Read authentic reviews from our community 
            of nature lovers and adventure enthusiasts.
          </p>
        </motion.div>

        {/* Rating Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl font-bold text-emerald-600 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-6 w-6 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <p className="text-gray-600">Based on {reviews.length} reviews</p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Rating</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedRating(null)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedRating === null ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                }`}
              >
                All Reviews ({reviews.length})
              </button>
              {[5, 4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedRating === rating ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                  }`}
                >
                  {rating} Stars ({ratingDistribution.find(r => r.rating === rating)?.count || 0})
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {review.avatar ? (
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-emerald-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        {review.name}
                        {review.verified && (
                          <span className="ml-2 bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">{review.packageName}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-6 w-6 text-emerald-200" />
                    <p className="text-gray-700 leading-relaxed pl-4">{review.review}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">Helpful ({review.helpful})</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">Reply</span>
                    </button>
                  </div>
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
          <div className="bg-emerald-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Share Your Adventure Story</h3>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Been on one of our treks? We'd love to hear about your experience! 
              Your review helps fellow adventurers choose their perfect Kerala journey.
            </p>
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
              Write a Review
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;