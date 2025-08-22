// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

// Only show warning if both are missing (not using fallbacks)
if (!import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using demo Supabase configuration. For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Package {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  price: number;
  original_price?: number;
  duration: string;
  group_size: string;
  location: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  category: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary?: any[];
  rating: number;
  review_count: number;
  booking_count: number;
  status: 'Active' | 'Draft' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface Trail {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  duration: string;
  elevation: string;
  location: string;
  features: string[];
  status: 'Active' | 'Draft' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface EcoStay {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  original_price?: number;
  location: string;
  amenities: string[];
  eco_features: string[];
  rating: number;
  review_count: number;
  booking_count: number;
  status: 'Active' | 'Draft' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_id: string;
  user_id: string;
  package_id?: string;
  trail_id?: string;
  eco_stay_id?: string;
  booking_type: 'package' | 'trail' | 'eco_stay';
  participants: number;
  booking_date: string;
  special_requests?: string;
  total_amount: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  payment_status: 'Pending' | 'Paid' | 'Refunded';
  admin_notes?: string;
  confirmation_sent: boolean;
  created_at: string;
  updated_at: string;
  users?: User;
  packages?: Package;
  trails?: Trail;
  eco_stays?: EcoStay;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

// Create default admin user if it doesn't exist
export const createDefaultAdmin = async () => {
  try {
    // Check if admin user already exists
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', 'admin')
      .limit(1);

    if (existingAdmin && existingAdmin.length > 0) {
      console.log('Admin user already exists');
      return { success: true, message: 'Admin user already exists' };
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create the admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        username: 'admin',
        password_hash: hashedPassword,
        email: 'admin@keralatrekking.com',
        full_name: 'System Administrator',
        role: 'admin',
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating admin user:', error);
      return { success: false, error: error.message };
    }

    console.log('Default admin user created successfully');
    return { success: true, data };
  } catch (error) {
    console.error('Error in createDefaultAdmin:', error);
    return { success: false, error: 'Failed to create admin user' };
  }
};

// Admin authentication
export const adminLogin = async (username: string, password: string) => {
  try {
    // First, try to create default admin if it doesn't exist
    await createDefaultAdmin();

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true);

    if (error) {
      console.error('Database error:', error);
      return { user: null, error: 'Database connection error' };
    }

    if (!data || data.length === 0) {
      return { user: null, error: 'Invalid username or user not found' };
    }

    const user = data[0];

    // Secure password check using bcryptjs
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return { user: null, error: 'Invalid password' };
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    return { user, error: null };
  } catch (error) {
    console.error('Login failed:', error);
    return { user: null, error: 'Login failed. Please try again.' };
  }
};

// Package operations
export const getPackages = async () => {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('status', 'Active')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getAllPackages = async () => {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Trail operations
export const getTrails = async () => {
  const { data, error } = await supabase
    .from('trails')
    .select('*')
    .eq('status', 'Active')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getAllTrails = async () => {
  const { data, error } = await supabase
    .from('trails')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Eco Stay operations
export const getEcoStays = async () => {
  const { data, error } = await supabase
    .from('eco_stays')
    .select('*')
    .eq('status', 'Active')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Booking operations
export const createBooking = async (bookingData: any) => {
  // First create or get user
  const { data: userData, error: userError } = await supabase
    .from('users')
    .upsert({
      full_name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      emergency_contact: bookingData.emergencyContact,
      emergency_phone: bookingData.emergencyPhone,
    })
    .select()
    .single();

  if (userError) {
    return { data: null, error: userError };
  }

  // Generate booking ID
  const bookingId = `BK${Date.now().toString().slice(-6)}`;

  // Create booking
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      booking_id: bookingId,
      user_id: userData.id,
      ...bookingData.bookingType === 'package' && { package_id: bookingData.itemId },
      ...bookingData.bookingType === 'trail' && { trail_id: bookingData.itemId },
      ...bookingData.bookingType === 'eco_stay' && { eco_stay_id: bookingData.itemId },
      booking_type: bookingData.bookingType,
      participants: bookingData.participants,
      booking_date: bookingData.date,
      special_requests: bookingData.specialRequests,
      total_amount: bookingData.totalAmount,
      status: 'Pending'
    })
    .select()
    .single();

  return { data, error };
};

export const getBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      users (*),
      packages (*),
      trails (*),
      eco_stays (*)
    `)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const updateBookingStatus = async (bookingId: string, status: string, adminNotes?: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ 
      status, 
      admin_notes: adminNotes,
      confirmation_sent: status === 'Confirmed'
    })
    .eq('id', bookingId)
    .select()
    .single();
  
  return { data, error };
};

// Gallery operations
export const getGalleryPhotos = async () => {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('status', 'Active')
    .order('sort_order', { ascending: true });
  
  return { data, error };
};