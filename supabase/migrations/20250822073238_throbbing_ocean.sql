/*
  # Complete Admin System Database Schema

  1. New Tables
    - `admin_users` - Admin authentication
    - `packages` - Trekking packages management
    - `trails` - Trekking trails management
    - `eco_stays` - Eco stays management
    - `bookings` - User bookings
    - `users` - Customer information
    - `reviews` - Customer reviews
    - `gallery_photos` - Photo gallery management
    - `notifications` - System notifications

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for admin and public access

  3. Features
    - Complete content management system
    - Booking management with notifications
    - User management
    - Review system
*/

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Packages Table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  price integer NOT NULL,
  original_price integer,
  duration text NOT NULL,
  group_size text NOT NULL,
  location text NOT NULL,
  difficulty text CHECK (difficulty IN ('Beginner', 'Intermediate', 'Expert')) DEFAULT 'Beginner',
  category text NOT NULL,
  highlights text[] DEFAULT '{}',
  inclusions text[] DEFAULT '{}',
  exclusions text[] DEFAULT '{}',
  itinerary jsonb DEFAULT '[]',
  rating decimal(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  booking_count integer DEFAULT 0,
  status text CHECK (status IN ('Active', 'Draft', 'Inactive')) DEFAULT 'Draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trails Table
CREATE TABLE IF NOT EXISTS trails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  difficulty text CHECK (difficulty IN ('Beginner', 'Intermediate', 'Expert')) DEFAULT 'Beginner',
  duration text NOT NULL,
  elevation text NOT NULL,
  location text NOT NULL,
  features text[] DEFAULT '{}',
  status text CHECK (status IN ('Active', 'Draft', 'Inactive')) DEFAULT 'Draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Eco Stays Table
CREATE TABLE IF NOT EXISTS eco_stays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  price integer NOT NULL,
  original_price integer,
  location text NOT NULL,
  amenities text[] DEFAULT '{}',
  eco_features text[] DEFAULT '{}',
  rating decimal(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  booking_count integer DEFAULT 0,
  status text CHECK (status IN ('Active', 'Draft', 'Inactive')) DEFAULT 'Draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  emergency_contact text,
  emergency_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
  trail_id uuid REFERENCES trails(id) ON DELETE CASCADE,
  eco_stay_id uuid REFERENCES eco_stays(id) ON DELETE CASCADE,
  booking_type text CHECK (booking_type IN ('package', 'trail', 'eco_stay')) NOT NULL,
  participants integer NOT NULL DEFAULT 1,
  booking_date date NOT NULL,
  special_requests text,
  total_amount integer NOT NULL,
  status text CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')) DEFAULT 'Pending',
  payment_status text CHECK (payment_status IN ('Pending', 'Paid', 'Refunded')) DEFAULT 'Pending',
  admin_notes text,
  confirmation_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
  trail_id uuid REFERENCES trails(id) ON DELETE CASCADE,
  eco_stay_id uuid REFERENCES eco_stays(id) ON DELETE CASCADE,
  review_type text CHECK (review_type IN ('package', 'trail', 'eco_stay')) NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title text,
  review_text text NOT NULL,
  is_verified boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  status text CHECK (status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Gallery Photos Table
CREATE TABLE IF NOT EXISTS gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  location text,
  photographer text,
  category text,
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  status text CHECK (status IN ('Active', 'Draft', 'Inactive')) DEFAULT 'Draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text CHECK (type IN ('booking', 'review', 'system', 'admin')) NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  recipient_email text,
  recipient_phone text,
  status text CHECK (status IN ('Pending', 'Sent', 'Failed')) DEFAULT 'Pending',
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE eco_stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Admin Users Policies
CREATE POLICY "Admin users can manage admin accounts"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (true);

-- Packages Policies
CREATE POLICY "Anyone can view active packages"
  ON packages
  FOR SELECT
  TO anon, authenticated
  USING (status = 'Active');

CREATE POLICY "Admins can manage packages"
  ON packages
  FOR ALL
  TO authenticated
  USING (true);

-- Trails Policies
CREATE POLICY "Anyone can view active trails"
  ON trails
  FOR SELECT
  TO anon, authenticated
  USING (status = 'Active');

CREATE POLICY "Admins can manage trails"
  ON trails
  FOR ALL
  TO authenticated
  USING (true);

-- Eco Stays Policies
CREATE POLICY "Anyone can view active eco stays"
  ON eco_stays
  FOR SELECT
  TO anon, authenticated
  USING (status = 'Active');

CREATE POLICY "Admins can manage eco stays"
  ON eco_stays
  FOR ALL
  TO authenticated
  USING (true);

-- Users Policies
CREATE POLICY "Anyone can create user accounts"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (true);

-- Bookings Policies
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (true);

-- Reviews Policies
CREATE POLICY "Anyone can view approved reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (status = 'Approved');

CREATE POLICY "Anyone can create reviews"
  ON reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (true);

-- Gallery Photos Policies
CREATE POLICY "Anyone can view active gallery photos"
  ON gallery_photos
  FOR SELECT
  TO anon, authenticated
  USING (status = 'Active');

CREATE POLICY "Admins can manage gallery photos"
  ON gallery_photos
  FOR ALL
  TO authenticated
  USING (true);

-- Notifications Policies
CREATE POLICY "Admins can manage notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, email, full_name) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@keralatrekking.com', 'System Administrator');

-- Insert sample packages
INSERT INTO packages (title, description, image_url, price, original_price, duration, group_size, location, difficulty, category, highlights, inclusions, exclusions) VALUES 
('Munnar Tea Garden Trek & Sunrise Experience', 'Experience sustainable luxury amidst bamboo groves and pristine forests.', 'https://images.pexels.com/photos/4321306/pexels-photo-4321306.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 3500, 4500, '2 Days, 1 Night', '6-12 people', 'Munnar, Idukki', 'Beginner', 'Trekking', 
ARRAY['Sunrise at Top Station', 'Tea plantation guided tour', 'Traditional Kerala breakfast', 'Photography sessions'],
ARRAY['Professional trek guide', 'All meals during trek', 'Accommodation', 'Safety equipment', 'First aid kit', 'Photography assistance', 'Certificate of completion', 'Transportation from meeting point'],
ARRAY['Personal trekking gear', 'Travel insurance', 'Personal expenses', 'Tips for guides', 'Emergency evacuation', 'Alcoholic beverages']),

('Wayanad Wildlife & Waterfall Adventure', 'Wildlife safari and waterfall adventure with challenging treks.', 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 5200, NULL, '3 Days, 2 Nights', '4-10 people', 'Wayanad', 'Intermediate', 'Adventure',
ARRAY['Chembra Peak trek', 'Soochipara Falls', 'Wildlife sanctuary visit', 'Bamboo rafting'],
ARRAY['Professional trek guide', 'All meals during trek', 'Accommodation', 'Safety equipment', 'First aid kit', 'Photography assistance', 'Certificate of completion', 'Transportation from meeting point'],
ARRAY['Personal trekking gear', 'Travel insurance', 'Personal expenses', 'Tips for guides', 'Emergency evacuation', 'Alcoholic beverages']);

-- Insert sample trails
INSERT INTO trails (name, description, image_url, difficulty, duration, elevation, location, features) VALUES 
('Anamudi Peak Trail', 'The highest peak in South India offers breathtaking panoramic views.', 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Expert', '6-8 hours', '2,695m', 'Munnar', 
ARRAY['Highest peak in South India', 'Rare Neelakurinji flowers', 'Shola forests', 'Wildlife spotting']),

('Chembra Peak Circuit', 'Famous for its heart-shaped lake and stunning valley views.', 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', 'Intermediate', '4-5 hours', '2,100m', 'Wayanad',
ARRAY['Heart-shaped lake', 'Valley views', 'Tea plantations', 'Cool climate']);

-- Insert sample eco stays
INSERT INTO eco_stays (name, description, image_url, price, original_price, location, amenities, eco_features) VALUES 
('Bamboo Grove Eco Resort', 'Experience sustainable luxury amidst bamboo groves and pristine forests.', 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 4500, 5500, 'Wayanad',
ARRAY['Free WiFi', 'Organic Meals', 'Nature Walks', 'Bird Watching'],
ARRAY['100% Solar Powered', 'Rainwater Harvesting', 'Organic Farming', 'Zero Waste']),

('Treehouse Sanctuary', 'Sleep among the treetops in our eco-friendly elevated accommodations.', 'https://images.pexels.com/photos/3889743/pexels-photo-3889743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 6200, NULL, 'Munnar',
ARRAY['Tree Top View', 'Organic Garden', 'Yoga Sessions', 'Meditation'],
ARRAY['Elevated Design', 'Minimal Impact', 'Local Materials', 'Wildlife Viewing']);

-- Insert sample gallery photos
INSERT INTO gallery_photos (title, image_url, alt_text, location, photographer, category, status) VALUES 
('Misty Mountains of Kerala', 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'Misty mountains of Kerala', 'Munnar Hills', 'Kerala Trekking Team', 'Mountains', 'Active'),
('Tea Plantation Landscape', 'https://images.pexels.com/photos/4321306/pexels-photo-4321306.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'Tea plantation landscape', 'Tea Gardens, Munnar', 'Adventure Guide', 'Plantations', 'Active'),
('Waterfall in Wayanad', 'https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'Waterfall in Wayanad', 'Soochipara Falls', 'Nature Explorer', 'Waterfalls', 'Active');

-- Update packages status to Active
UPDATE packages SET status = 'Active';
UPDATE trails SET status = 'Active';
UPDATE eco_stays SET status = 'Active';