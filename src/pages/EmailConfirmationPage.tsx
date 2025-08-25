import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { confirmUserEmail } from '../lib/auth';

const EmailConfirmationPage: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid confirmation link. Please check your email for the correct link.');
        return;
      }

      try {
        const result = await confirmUserEmail(token);
        if (result.success) {
          setStatus('success');
          setMessage(result.message);
          
          // Redirect to sign-in page after 3 seconds
          setTimeout(() => {
            window.location.href = '/?signin=true';
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    confirmEmail();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {status === 'loading' && (
          <>
            <Loader className="h-20 w-20 text-emerald-500 mx-auto mb-6 animate-spin" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Confirming Your Email</h1>
            <p className="text-gray-700 text-lg">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Email Confirmed!</h1>
            <p className="text-gray-700 text-lg mb-6">
              {message}
            </p>
            <p className="text-gray-600 mb-8">
              You can now sign in to your account. Redirecting you to the sign-in page...
            </p>
            <motion.button
              onClick={() => window.location.href = '/?signin=true'}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go to Sign In
            </motion.button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Confirmation Failed</h1>
            <p className="text-gray-700 text-lg mb-6">
              {message}
            </p>
            <p className="text-gray-600 mb-8">
              Please contact support if you continue to experience issues.
            </p>
            <motion.button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go to Home Page
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default EmailConfirmationPage;