import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

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