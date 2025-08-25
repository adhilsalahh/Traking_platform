import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown, Mail, Phone, Shield } from 'lucide-react';
import { UserProfile } from '../../lib/auth';

interface UserProfileDropdownProps {
  user: UserProfile;
  onSignOut?: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="text-gray-700 font-medium">{user.full_name}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.email_confirmed && (
                      <Shield className="h-3 w-3 text-green-500" title="Email Verified" />
                    )}
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-4 space-y-3">
              <h4 className="font-medium text-gray-900 text-sm">Profile Information</h4>
              
              {user.emergency_contact && (
                <div>
                  <p className="text-xs text-gray-500">Emergency Contact</p>
                  <p className="text-sm text-gray-700">{user.emergency_contact}</p>
                  {user.emergency_phone && (
                    <p className="text-sm text-gray-600">{user.emergency_phone}</p>
                  )}
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm text-gray-700">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {user.last_login && (
                <div>
                  <p className="text-xs text-gray-500">Last Login</p>
                  <p className="text-sm text-gray-700">
                    {new Date(user.last_login).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Implement profile settings modal
                  alert('Profile settings coming soon!');
                }}
                className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">Profile Settings</span>
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  onSignOut?.();
                }}
                className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-red-50 transition-colors text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfileDropdown;