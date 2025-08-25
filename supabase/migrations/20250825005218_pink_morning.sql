/*
  # Fix RLS policies for user registration

  1. Security Updates
    - Update RLS policies for users table to allow registration
    - Allow authenticated users to insert their own profiles
    - Allow users to read and update their own data
    - Maintain admin access for management

  2. Policy Changes
    - Remove restrictive policies that prevent registration
    - Add proper policies for user self-management
    - Ensure admins can manage all users
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can create user profiles" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create new policies that allow proper user registration and management
CREATE POLICY "Allow user registration"
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

-- Also fix user_confirmations table policies
DROP POLICY IF EXISTS "System can insert confirmations" ON user_confirmations;
DROP POLICY IF EXISTS "System can update confirmations" ON user_confirmations;
DROP POLICY IF EXISTS "Users can view their own confirmations" ON user_confirmations;

CREATE POLICY "Allow confirmation creation"
  ON user_confirmations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow confirmation updates"
  ON user_confirmations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view own confirmations"
  ON user_confirmations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);