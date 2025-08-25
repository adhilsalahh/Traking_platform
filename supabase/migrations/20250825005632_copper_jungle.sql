/*
  # Fix User Registration RLS Policy

  1. Security Updates
    - Drop existing restrictive policies on users table
    - Create proper policies that allow user registration
    - Allow authenticated users to insert their own profile
    - Allow users to read and update their own data
    - Allow admins full access

  2. Key Changes
    - Fix INSERT policy to allow auth.uid() = auth_user_id
    - Ensure proper user registration flow
    - Maintain security while allowing registration
*/

-- Drop existing policies that might be blocking registration
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create new policies that properly allow user registration
CREATE POLICY "Allow authenticated user registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Allow admins full access (assuming admin check function exists)
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
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = auth.uid()::text 
      AND is_active = true
    )
  );

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;