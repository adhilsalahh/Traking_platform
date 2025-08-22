import React, { useState } from 'react';
import { Menu, X, Mountain } from 'lucide-react';

interface HeaderProps {
  onAuthClick?: () => void;
  onAdminClick?: () => void;
}

export default function Header({ onAuthClick, onAdminClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Mountain className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">EcoTrails</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </a>
            <a href="#trails" className="text-gray-700 hover:text-green-600 transition-colors">
              Trails
            </a>
            <a href="#packages" className="text-gray-700 hover:text-green-600 transition-colors">
              Packages
            </a>
            <a href="#eco-stays" className="text-gray-700 hover:text-green-600 transition-colors">
              Eco Stays
            </a>
            <a href="#gallery" className="text-gray-700 hover:text-green-600 transition-colors">
              Gallery
            </a>
            <a href="#reviews" className="text-gray-700 hover:text-green-600 transition-colors">
              Reviews
            </a>
          </nav>

          {/* Auth & Admin Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {onAuthClick && (
              <button
                onClick={onAuthClick}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Sign In
              </button>
            )}
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Admin
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a
                href="#home"
                className="text-gray-700 hover:text-green-600 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#trails"
                className="text-gray-700 hover:text-green-600 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Trails
              </a>
              <a
                href="#packages"
                className="text-gray-700 hover:text-green-600 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Packages
              </a>
              <a
                href="#eco-stays"
                className="text-gray-700 hover:text-green-600 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Eco Stays
              </a>
              <a
                href="#gallery"
                className="text-gray-700 hover:text-green-600 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </a>
              <a
                href="#reviews"
                className="text-gray-700 hover:text-green-600 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Reviews
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {onAuthClick && (
                  <button
                    onClick={() => {
                      onAuthClick();
                      setIsMenuOpen(false);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-left"
                  >
                    Sign In
                  </button>
                )}
                {onAdminClick && (
                  <button
                    onClick={() => {
                      onAdminClick();
                      setIsMenuOpen(false);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    Admin
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}