import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold mb-4">
              Kerala<span className="text-orange-500">Trekking</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Your trusted partner for Kerala's most spectacular trekking adventures. 
              From misty mountains to pristine forests, we help you discover the untouched beauty of God's Own Country.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-gray-300 hover:text-emerald-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#packages" className="text-gray-300 hover:text-emerald-400 transition-colors">Trekking Packages</a></li>
              <li><a href="#eco-stays" className="text-gray-300 hover:text-emerald-400 transition-colors">Eco Stays</a></li>
              <li><a href="#trails" className="text-gray-300 hover:text-emerald-400 transition-colors">Trail Guide</a></li>
              <li><a href="#safety" className="text-gray-300 hover:text-emerald-400 transition-colors">Safety Guidelines</a></li>
              <li><a href="#gallery" className="text-gray-300 hover:text-emerald-400 transition-colors">Gallery</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">Munnar, Kerala, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">info@keralatrekking.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Kerala Trekking. All rights reserved. | 
            <span className="text-emerald-400"> A complete digital adventure hub</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;