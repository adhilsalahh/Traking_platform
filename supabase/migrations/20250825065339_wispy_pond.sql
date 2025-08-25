/*
  # Fix Complete User Registration and Authentication System

  1. Database Schema Updates
    - Fix users table structure
    - Update RLS policies for proper access control
    - Ensure admin panel can view all users
    - Fix user registration flow

  2. Security Policies
    - Allow user registration (INSERT)
    - Allow users to read their own data
    - Allow admins to manage all users
    - Proper authentication checks

  3. User Management
    - Fix user profile creation
    - Enable admin user viewing
    - Proper data synchronization
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Allow authenticated user registration" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Ensure users table has proper structure
ALTER TABLE users 
  ALTER COLUMN auth_user_id DROP NOT NULL;

-- Create proper RLS policies for users table
CREATE POLICY "Enable insert for authenticated users" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Enable read for users on their own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Enable update for users on their own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Enable delete for users on their own data" ON users
  FOR DELETE TO authenticated
  USING (auth.uid() = auth_user_id);

-- Admin policies for user management
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id::text = auth.uid()::text 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id::text = auth.uid()::text 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id::text = auth.uid()::text 
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can delete users" ON users
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id::text = auth.uid()::text 
      AND admin_users.is_active = true
    )
  );

-- Fix user_confirmations table policies
DROP POLICY IF EXISTS "Users can view own confirmations" ON user_confirmations;
DROP POLICY IF EXISTS "Allow confirmation creation" ON user_confirmations;
DROP POLICY IF EXISTS "Allow confirmation updates" ON user_confirmations;

CREATE POLICY "Enable insert for authenticated users" ON user_confirmations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users" ON user_confirmations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable update for authenticated users" ON user_confirmations
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Create function to confirm user email
CREATE OR REPLACE FUNCTION confirm_user_email(confirmation_token uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  confirmation_record user_confirmations%ROWTYPE;
  user_record users%ROWTYPE;
BEGIN
  -- Find the confirmation record
  SELECT * INTO confirmation_record
  FROM user_confirmations
  WHERE user_confirmations.confirmation_token = confirm_user_email.confirmation_token
    AND confirmed_at IS NULL
    AND expires_at > now();

  -- Check if confirmation exists and is valid
  IF confirmation_record.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Invalid or expired confirmation token'
    );
  END IF;

  -- Update confirmation record
  UPDATE user_confirmations
  SET confirmed_at = now()
  WHERE id = confirmation_record.id;

  -- Update user email_confirmed status
  UPDATE users
  SET email_confirmed = true
  WHERE auth_user_id = confirmation_record.user_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Email confirmed successfully! You can now sign in to your account.'
  );
END;
$$;