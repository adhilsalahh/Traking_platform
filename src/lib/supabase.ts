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
    // Check if admin user already exists and get the current data
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id, password_hash')
      .eq('username', 'admin')
      .limit(1);

    // Hash the default password
    const defaultPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    if (existingAdmin && existingAdmin.length > 0) {
      // Admin exists, but check if password hash is correct
      const currentAdmin = existingAdmin[0];
      
      // Verify if the current password hash matches the default password
      const isPasswordCorrect = await bcrypt.compare(defaultPassword, currentAdmin.password_hash);
      
      if (!isPasswordCorrect) {
        // Update the password hash to match the default password
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ 
            password_hash: hashedPassword,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentAdmin.id);

        if (updateError) {
          console.error('Error updating admin password:', updateError);
          return { success: false, error: updateError.message };
        }
        
        console.log('Admin password updated to match default credentials');
        return { success: true, message: 'Admin password updated successfully' };
      }
      
      console.log('Admin user already exists with correct password');
      return { success: true, message: 'Admin user already exists' };
    }

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
    // await createDefaultAdmin(); // Removed as per plan

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

// User Authentication (New functions)
export const registerUser = async (full_name: string, email: string, phone: string, password: string) => {
  try {
    // First, sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone,
        },
      },
    });

    if (authError) {
      // Handle the confusing "Email address is invalid" error that often means email is already registered
      if (authError.message.includes('Email address') && authError.message.includes('is invalid')) {
        return { user: null, error: 'This email address might already be registered. Please try signing in instead or use a different email.' };
      }
      return { user: null, error: authError.message };
    }

    if (authData.user && authData.session) {
      // Set the session to ensure the user is authenticated for the next request
      await supabase.auth.setSession(authData.session);
      
      // Insert user profile into public.users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id, // Link to auth.users ID
          full_name,
          email,
          phone,
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user profile:', userError);
        // If RLS policy blocks the insert, it means the policy needs to be updated
        if (userError.message.includes('row-level security policy') || userError.code === '42501') {
          return { 
            user: null, 
            error: 'Registration failed: Database security policy needs to be configured. Please ensure the RLS policy on the users table allows authenticated users to insert their own profile with: auth.uid() = id' 
          };
        }
        return { user: null, error: `Failed to create user profile: ${userError.message}` };
      }
      return { user: userData, error: null };
    } else if (authData.user && !authData.session) {
      // User was created but no session (email confirmation required)
      return { 
        user: null, 
        error: 'Registration successful! Please check your email to confirm your account before signing in.' 
      };
    }
    return { user: null, error: 'Registration failed: No user data returned.' };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { user: null, error: error.message || 'Registration failed. Please try again.' };
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'No user data returned from authentication' };
    }

    // Check if user profile exists in public.users table
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means "no rows found", which is expected for new users
      console.error('Error fetching user profile:', fetchError);
      return { user: null, error: 'Failed to fetch user profile' };
    }

    if (existingUser) {
      // User profile already exists, return it
      return { user: existingUser, error: null };
    }

    // User profile doesn't exist, create it from auth user metadata
    const userMetadata = authData.user.user_metadata || {};
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        full_name: userMetadata.full_name || '',
        email: authData.user.email || email,
        phone: userMetadata.phone || '',
        emergency_contact: userMetadata.emergency_contact || null,
        emergency_phone: userMetadata.emergency_phone || null,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating user profile on sign-in:', createError);
      return { user: null, error: 'Failed to create user profile' };
    }

    return { user: newUser, error: null };
  } catch (error: any) {
    console.error('Sign-in error:', error);
    return { user: null, error: error.message || 'Sign-in failed. Please try again.' };
  }
};

// Supabase Storage for Package Images (New functions)
export const uploadPackageImage = async (file: File, packageName: string) => {
  const fileExtension = file.name.split('.').pop();
  const fileName = `${packageName.replace(/\s+/g, '_').toLowerCase()}-${Date.now()}.${fileExtension}`;
  const filePath = `public/${fileName}`; // Store in a 'public' folder within the bucket

  const { data, error } = await supabase.storage
    .from('package-images') // Ensure this bucket exists in Supabase
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('package-images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

export const deletePackageImage = async (imageUrl: string) => {
  // Extract the path within the bucket from the public URL
  const pathSegments = imageUrl.split('/');
  const bucketNameIndex = pathSegments.indexOf('package-images');
  if (bucketNameIndex === -1 || bucketNameIndex + 1 >= pathSegments.length) {
    console.warn('Could not extract file path from image URL for deletion:', imageUrl);
    return;
  }
  const filePath = pathSegments.slice(bucketNameIndex + 1).join('/');

  const { error } = await supabase.storage
    .from('package-images')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting image from storage:', error);
    throw error;
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
    }, { onConflict: 'email' }) // Upsert based on email
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
