/*
  # Create Admin User

  1. New Records
    - `admin_users`
      - Creates a default admin user with username 'admin' and password 'admin123'
      - Sets up basic admin profile with active status
  
  2. Security
    - Uses simple password for demo purposes (in production, use proper bcrypt hashing)
    - Sets user as active and assigns admin role
  
  3. Notes
    - This is for development/demo purposes
    - In production, passwords should be properly hashed using bcrypt
*/

INSERT INTO admin_users (
  username,
  password_hash,
  email,
  full_name,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  'admin',
  'admin123',
  'admin@keralatrekking.com',
  'System Administrator',
  'admin',
  true,
  now(),
  now()
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  is_active = EXCLUDED.is_active,
  updated_at = now();