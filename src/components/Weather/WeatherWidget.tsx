import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

const WeatherWidget: React.FC<{ location: string }> = ({ location }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate weather API call
    const fetchWeather = async () => {
      setLoading(true);
      // Mock weather data - in production, you'd call a real weather API
      setTimeout(() => {
        const mockWeather: WeatherData = {
          location,
          temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
          condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 30) + 60, // 60-90%
          windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
          icon: 'sunny'
        };
        setWeather(mockWeather);
        setLoading(false);
      }, 1000);
    };

    fetchWeather();
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'partly cloudy': return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-600" />;
      case 'light rain': return <CloudRain className="h-8 w-8 text-blue-500" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div 
      className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg shadow-md p-4 border border-blue-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Weather in {weather.location}</h3>
        {getWeatherIcon(weather.condition)}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Thermometer className="h-4 w-4 text-red-500" />
          <span className="text-2xl font-bold text-gray-900">{weather.temperature}°C</span>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">{weather.condition}</p>
        </div>
      </div>
      
      <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-1">
          <Droplets className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-600">{weather.humidity}%</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Wind className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{weather.windSpeed} km/h</span>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-emerald-100 rounded text-center">
        <p className="text-xs text-emerald-800">Perfect weather for trekking!</p>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;