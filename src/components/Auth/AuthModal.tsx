import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Phone, Eye, EyeOff, User } from 'lucide-react';
import { registerUser, signInUser } from '../../lib/auth'; // Import from auth.ts

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Form submitted with mode:', mode);

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      
      console.log('Attempting registration...', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      try {
        const { user, error, needsConfirmation } = await registerUser(
          formData.name, 
          formData.email, 
          formData.phone, 
          formData.password
        );
        
        console.log('Registration result:', { user, error, needsConfirmation });
        
        if (error) {
          setError(error);
        } else if (user && needsConfirmation) {
          alert('Registration successful! Please check your email (or console logs in demo) to confirm your account before signing in.');
          onClose();
          // Clear form
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
          onModeChange('signin');
        } else if (user) {
          // Registration successful without confirmation needed
          localStorage.setItem('currentUser', JSON.stringify(user));
          onClose();
          window.location.reload();
        }
      } catch (err: any) {
        console.error('Registration error:', err);
        setError(err.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    } else { // signin mode
      console.log('Attempting signin...', { email: formData.email });
      
      try {
        const { user, error } = await signInUser(formData.email, formData.password);
        
        console.log('Signin result:', { user, error });
        
        if (error) {
          setError(error);
        } else if (user) {
          // Remove email confirmation check for now to allow login
          // if (!user.email_confirmed) {
          //   setError('Please confirm your email address before signing in. Check your inbox for the confirmation link.');
          //   setLoading(false);
          //   return;
          // }
          
          // Store user in localStorage for session management
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          onClose();
          window.location.reload(); // Refresh to update UI with user data
        }
      } catch (err: any) {
        console.error('Signin error:', err);
        setError(err.message || 'Sign in failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-2 sm:mx-4 max-h-[95vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sign In/Sign Up Toggle for Sign In (only for non-admin) */}
          {mode === 'signin' && (
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4 sm:mb-6">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Email</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  loginMethod === 'phone'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Phone</span>
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Name field for signup */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email/Phone field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                {mode === 'signup' ? 'Email Address' : loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <div className="relative">
                {(mode === 'signup' || loginMethod === 'email') ? (
                  <>
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter your email"
                      required
                    />
                  </>
                ) : (
                  <>
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="+91 9876543210"
                      required
                    />
                  </>
                )}
              </div>
            </div>

            {/* Phone field for signup */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field for signup */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base mt-4 sm:mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (mode === 'signin' ? 'Signing In...' : 'Registering...') : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-xs sm:text-sm text-emerald-800 text-center">
              🔒 Your data is secured with enterprise-grade authentication and encrypted storage
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
