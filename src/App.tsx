import React, { useState } from 'react';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HeroSection from './components/Hero/HeroSection';
import PackagesSection from './components/Packages/PackagesSection';
import TrailsSection from './components/Trails/TrailsSection';
import EcoStaysSection from './components/EcoStays/EcoStaysSection';
import ReviewsSection from './components/Reviews/ReviewsSection';
import PhotoGallery from './components/Gallery/PhotoGallery';
import WeatherWidget from './components/Weather/WeatherWidget';
import NotificationSystem from './components/Notifications/NotificationSystem';
import AuthModal from './components/Auth/AuthModal';
import AdminPanel from './components/Admin/AdminPanel';
import SignUpSuccessPage from './pages/SignUpSuccessPage'; // Import the new page

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [notifications, setNotifications] = useState<any[]>([]);

  const addNotification = (notification: any) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const galleryPhotos = [
    {
      id: '1',
      src: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Misty mountains of Kerala',
      location: 'Munnar Hills',
      photographer: 'Kerala Trekking Team'
    },
    {
      id: '2',
      src: 'https://images.pexels.com/photos/4321306/pexels-photo-4321306.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Tea plantation landscape',
      location: 'Tea Gardens, Munnar',
      photographer: 'Adventure Guide'
    },
    {
      id: '3',
      src: 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Waterfall in Wayanad',
      location: 'Soochipara Falls',
      photographer: 'Nature Explorer'
    },
    {
      id: '4',
      src: 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Backwater views',
      location: 'Kumarakom Backwaters',
      photographer: 'Eco Guide'
    },
    {
      id: '5',
      src: 'https://images.pexels.com/photos/3889743/pexels-photo-3889743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Forest trail',
      location: 'Thekkady Wildlife Sanctuary',
      photographer: 'Wildlife Expert'
    },
    {
      id: '6',
      src: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Peak summit view',
      location: 'Agasthyakoodam Peak',
      photographer: 'Mountain Guide'
    }
  ];

  // Check if we're on admin route
  if (window.location.pathname === '/admin') {
    return <AdminPanel />;
  }

  // Check if we're on signup success route
  if (window.location.pathname === '/signup-success') {
    return <SignUpSuccessPage />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onAuthClick={() => setIsAuthModalOpen(true)}
      />
      
      <main>
        <HeroSection />
        <PackagesSection />
        <TrailsSection />
        <EcoStaysSection />
        <ReviewsSection />
        <PhotoGallery 
          photos={galleryPhotos} 
          title="Capture Kerala's Beauty"
        />
      </main>

      <Footer />

      {/* Weather Widget */}
      <div className="fixed bottom-4 left-4 z-40">
        <WeatherWidget location="Munnar" />
      </div>

      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onRemove={removeNotification}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
        }}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      {/* Demo notification trigger */}
      <button
        onClick={() => addNotification({
          type: 'success',
          title: 'Booking Confirmed!',
          message: 'Your Kerala adventure is confirmed. Check your email for details.',
          duration: 5000
        })}
        className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors z-40"
      >
        Test Notification
      </button>
    </div>
  );
}

export default App;
