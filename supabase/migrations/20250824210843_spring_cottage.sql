/*
  # Complete User Registration & Management System

  1. New Tables
    - Enhanced `users` table with auth integration
    - Updated `packages` table with image storage
    - Enhanced `bookings` table with comprehensive tracking
    - `user_confirmations` table for email verification

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admins
    - Secure user data access

  3. Functions
    - User confirmation handling
    - Booking ID generation
    - Admin user management

  4. Storage
    - Package images bucket with proper policies
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_confirmations table for email verification
CREATE TABLE IF NOT EXISTS user_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  confirmation_token uuid DEFAULT gen_random_uuid(),
  confirmed_at timestamptz,
  expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on user_confirmations
ALTER TABLE user_confirmations ENABLE ROW LEVEL SECURITY;

-- Update users table to link with auth.users
DO $$
BEGIN
  -- Add auth_user_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE users ADD COLUMN auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Add email_confirmed column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email_confirmed'
  ) THEN
    ALTER TABLE users ADD COLUMN email_confirmed boolean DEFAULT false;
  END IF;

  -- Add last_login column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE users ADD COLUMN last_login timestamptz;
  END IF;
END $$;

-- Update packages table for better image handling
DO $$
BEGIN
  -- Add image_path column for Supabase Storage if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'image_path'
  ) THEN
    ALTER TABLE packages ADD COLUMN image_path text;
  END IF;

  -- Add created_by column to track admin who created the package
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE packages ADD COLUMN created_by uuid REFERENCES admin_users(id);
  END IF;
END $$;

-- Update bookings table with enhanced tracking
DO $$
BEGIN
  -- Add confirmation_email_sent column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'confirmation_email_sent'
  ) THEN
    ALTER TABLE bookings ADD COLUMN confirmation_email_sent boolean DEFAULT false;
  END IF;

  -- Add whatsapp_sent column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'whatsapp_sent'
  ) THEN
    ALTER TABLE bookings ADD COLUMN whatsapp_sent boolean DEFAULT false;
  END IF;

  -- Add booking_reference column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'booking_reference'
  ) THEN
    ALTER TABLE bookings ADD COLUMN booking_reference text UNIQUE;
  END IF;
END $$;

-- RLS Policies for user_confirmations
CREATE POLICY "Users can view their own confirmations"
  ON user_confirmations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert confirmations"
  ON user_confirmations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update confirmations"
  ON user_confirmations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Enhanced RLS Policies for users table
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Anyone can create user accounts" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;

CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id OR auth.uid() = id::uuid);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id OR auth.uid() = id::uuid);

CREATE POLICY "Anyone can create user profiles"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id OR auth.uid() = id::uuid);

CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

-- Enhanced RLS Policies for packages table
DROP POLICY IF EXISTS "Anyone can view active packages" ON packages;
DROP POLICY IF EXISTS "Admins can manage packages" ON packages;

CREATE POLICY "Anyone can view active packages"
  ON packages
  FOR SELECT
  TO anon, authenticated
  USING (status = 'Active');

CREATE POLICY "Admins can view all packages"
  ON packages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can manage packages"
  ON packages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

-- Enhanced RLS Policies for bookings table
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can manage bookings" ON bookings;

CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id::uuid OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_user_id = auth.uid() 
      AND users.id = bookings.user_id
    )
  );

CREATE POLICY "Authenticated users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage all bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

-- Function to generate unique booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS text AS $$
DECLARE
  reference text;
  exists_check boolean;
BEGIN
  LOOP
    reference := 'BK' || LPAD(floor(random() * 1000000)::text, 6, '0');
    
    SELECT EXISTS(
      SELECT 1 FROM bookings WHERE booking_reference = reference
    ) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN reference;
END;
$$ LANGUAGE plpgsql;

-- Function to handle user confirmation
CREATE OR REPLACE FUNCTION confirm_user_email(confirmation_token uuid)
RETURNS json AS $$
DECLARE
  confirmation_record user_confirmations%ROWTYPE;
  result json;
BEGIN
  -- Find the confirmation record
  SELECT * INTO confirmation_record
  FROM user_confirmations
  WHERE confirmation_token = confirm_user_email.confirmation_token
    AND confirmed_at IS NULL
    AND expires_at > now();

  IF confirmation_record.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Invalid or expired confirmation token'
    );
  END IF;

  -- Mark as confirmed
  UPDATE user_confirmations
  SET confirmed_at = now()
  WHERE id = confirmation_record.id;

  -- Update user as email confirmed
  UPDATE users
  SET email_confirmed = true
  WHERE auth_user_id = confirmation_record.user_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Email confirmed successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically generate booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS trigger AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_booking_reference_trigger ON bookings;
CREATE TRIGGER set_booking_reference_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_reference();

-- Create storage bucket for package images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('package-images', 'package-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for package images
CREATE POLICY "Anyone can view package images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'package-images');

CREATE POLICY "Admins can upload package images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'package-images' AND
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can update package images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'package-images' AND
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can delete package images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'package-images' AND
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );