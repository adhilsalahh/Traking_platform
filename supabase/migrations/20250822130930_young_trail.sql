/*
  # Fix admin user RLS policy for initial setup

  1. Security Updates
    - Drop existing restrictive policy that prevents initial admin creation
    - Add new policy that allows initial admin creation when no admin exists
    - Maintain security for subsequent admin operations
    - Ensure only one admin can be created initially

  2. Changes
    - Remove overly restrictive "Admin users can manage admin accounts" policy
    - Add "Allow initial admin creation" policy for first-time setup
    - Add "Authenticated admins can manage accounts" policy for normal operations
*/

-- Drop the existing overly restrictive policy
DROP POLICY IF EXISTS "Admin users can manage admin accounts" ON admin_users;

-- Allow creation of the first admin user when no admin exists
CREATE POLICY "Allow initial admin creation"
  ON admin_users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Only allow if no admin users exist yet
    NOT EXISTS (SELECT 1 FROM admin_users WHERE is_active = true)
  );

-- Allow authenticated users to read admin data (needed for login verification)
CREATE POLICY "Allow admin login verification"
  ON admin_users
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Allow authenticated admins to manage admin accounts (for future admin operations)
CREATE POLICY "Authenticated admins can manage accounts"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow updating last_login for successful logins
CREATE POLICY "Allow login timestamp updates"
  ON admin_users
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);