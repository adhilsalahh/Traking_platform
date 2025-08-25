import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

// User registration and authentication types
export interface UserProfile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone: string;
  emergency_contact?: string;
  emergency_phone?: string;
  email_confirmed: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: UserProfile | null;
  error: string | null;
  needsConfirmation?: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// User Registration
export const registerUser = async (
  full_name: string, 
  email: string, 
  phone: string, 
  password: string
): Promise<AuthResponse> => {
  try {
    console.log('Starting user registration...', { full_name, email, phone });
    
    // Sign up the user with Supabase Auth
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
      console.error('Auth signup error:', authError);
      return { user: null, error: authError.message };
    }

    console.log('Auth signup successful:', authData);

    if (authData.user) {
      // Create user profile in public.users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          auth_user_id: authData.user.id,
          full_name,
          email,
          phone,
          email_confirmed: false
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user profile:', userError);
        // If user profile creation fails, still continue with confirmation
        console.log('User profile creation failed, but auth user exists');
      }

      console.log('User profile created:', userData);

      // Create confirmation record
      const { data: confirmationData, error: confirmationError } = await supabase
        .from('user_confirmations')
        .insert({
          user_id: authData.user.id,
        })
        .select()
        .single();

      if (confirmationError) {
        console.error('Error creating confirmation:', confirmationError);
      }

      console.log('Confirmation record created:', confirmationData);

      // Send confirmation email (mock implementation)
      await sendConfirmationEmail(email, full_name, confirmationData?.confirmation_token);

      return { 
        user: userData || null, 
        error: null, 
        needsConfirmation: true 
      };
    }

    return { user: null, error: 'Registration failed: No user data returned.' };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { user: null, error: error.message || 'Registration failed. Please try again.' };
  }
};

// User Sign In
export const signInUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log('Starting user sign in...', { email });
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Auth signin error:', authError);
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'No user data returned from authentication' };
    }

    console.log('Auth signin successful:', authData.user);

    // Get user profile from public.users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      
      // If profile doesn't exist, create it from auth user data
      const userMetadata = authData.user.user_metadata || {};
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert({
          auth_user_id: authData.user.id,
          full_name: userMetadata.full_name || '',
          email: authData.user.email || email,
          phone: userMetadata.phone || '',
          email_confirmed: true // Assume confirmed if they can sign in
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user profile on signin:', createError);
        return { user: null, error: 'Failed to create user profile' };
      }

      console.log('User profile created on signin:', newProfile);
      
      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', newProfile.id);

      return { user: newProfile, error: null };
    }

    console.log('User profile found:', userProfile);

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userProfile.id);

    return { user: userProfile, error: null };
  } catch (error: any) {
    console.error('Sign-in error:', error);
    return { user: null, error: error.message || 'Sign-in failed. Please try again.' };
  }
};

// Get current user profile
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching current user:', error);
      return null;
    }

    return userProfile;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Sign out user
export const signOutUser = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (error: any) {
    return { error: error.message || 'Sign out failed' };
  }
};

// Confirm user email
export const confirmUserEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { data, error } = await supabase.rpc('confirm_user_email', {
      confirmation_token: token
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return data;
  } catch (error: any) {
    return { success: false, message: error.message || 'Confirmation failed' };
  }
};

// Mock email sending function (replace with actual email service)
const sendConfirmationEmail = async (email: string, name: string, token?: string) => {
  // In a real application, you would integrate with an email service like:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Resend
  
  console.log(`
    📧 CONFIRMATION EMAIL SENT TO: ${email}
    
    Hi ${name},
    
    Thank you for registering with Kerala Trekking!
    
    Please click the link below to confirm your email address:
    ${window.location.origin}/confirm-email?token=${token}
    
    This link will expire in 24 hours.
    
    Best regards,
    Kerala Trekking Team
  `);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
};

// Admin authentication
export const adminLogin = async (username: string, password: string) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { user: null, error: 'Invalid username or user not found' };
    }

    // Compare password with bcrypt
    const isValidPassword = await bcrypt.compare(password, data.password_hash);
    
    if (!isValidPassword) {
      return { user: null, error: 'Invalid password' };
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id);

    // Store in localStorage
    const adminUser: AdminUser = {
      id: data.id,
      username: data.username,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      is_active: data.is_active,
      last_login: new Date().toISOString(),
      created_at: data.created_at,
      updated_at: data.updated_at
    };

    localStorage.setItem('adminUser', JSON.stringify(adminUser));
    
    return { user: adminUser, error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { user: null, error: 'Login failed. Please try again.' };
  }
};

export const adminLogout = () => {
  localStorage.removeItem('adminUser');
  window.location.href = '/';
};

export const getStoredAdmin = (): AdminUser | null => {
  try {
    const stored = localStorage.getItem('adminUser');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const isAdminAuthenticated = (): boolean => {
  const admin = getStoredAdmin();
  return admin !== null && admin.is_active;
};

// Hash password for creating new admin users
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};