import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const SignUpSuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h1>
        <p className="text-gray-700 text-lg mb-6">
          Your account has been successfully created.
        </p>
        <p className="text-gray-600 mb-8">
          You can now sign in to explore our trekking packages and manage your bookings.
        </p>
        <motion.button
          onClick={() => window.location.href = '/'}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Go to Home Page & Sign In
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SignUpSuccessPage;