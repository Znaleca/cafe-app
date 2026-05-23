-- Supabase Schema for Her&Her Cafe

-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  nickname TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for menu_items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menu items are viewable by everyone."
  ON public.menu_items FOR SELECT
  USING ( true );

-- Policy to allow only admins to insert/update/delete menu items
CREATE POLICY "Admins can insert menu items."
  ON public.menu_items FOR INSERT
  WITH CHECK ( 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update menu items."
  ON public.menu_items FOR UPDATE
  USING ( 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete menu items."
  ON public.menu_items FOR DELETE
  USING ( 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, nickname)
  VALUES (
    NEW.id,
    'customer',
    NEW.raw_user_meta_data->>'nickname'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create a profile automatically when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Orders System
-- ============================================================

-- Create orders table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'order placed', 'preparing', 'ready', 'completed', 'cancelled')),
  total_amount NUMERIC(10, 2) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  is_reviewed BOOLEAN DEFAULT FALSE,
  delivery_lat NUMERIC,
  delivery_lng NUMERIC,
  delivery_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Any authenticated user (customer or admin) can insert orders
CREATE POLICY "Authenticated users can insert orders."
  ON public.orders FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Customers can view their own orders
CREATE POLICY "Customers can view their own orders."
  ON public.orders FOR SELECT
  USING ( auth.uid() = user_id );

-- Customers can update their own orders (needed for setting is_reviewed to true)
CREATE POLICY "Customers can update their own orders."
  ON public.orders FOR UPDATE
  USING ( auth.uid() = user_id );

-- Admins can view all orders
CREATE POLICY "Admins can view all orders."
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admins can update order status
CREATE POLICY "Admins can update orders."
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Insert some seed data
INSERT INTO public.menu_items (name, description, price, category, image_url) VALUES
('Sky Cloud Latte', 'Our signature blue matcha latte topped with whipped coconut cloud.', 6.50, 'Coffee', 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800'),
('Sparkle Croissant', 'Flaky, buttery croissant dusted with edible blue shimmer.', 4.50, 'Pastry', 'https://images.unsplash.com/photo-1549903072-7e6e0efeb2fa?auto=format&fit=crop&q=80&w=800'),
('Azure Matcha', 'Premium grade matcha mixed with butterfly pea flower.', 5.75, 'Tea', 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&q=80&w=800'),
('Her&Her Signature Brew', 'Smooth cold brew with notes of blueberry and dark chocolate.', 5.00, 'Coffee', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=800');

-- ============================================================
-- Reviews System
-- ============================================================

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('shop', 'item')),
  target_id TEXT NOT NULL, -- 'cafe' or item name
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews."
  ON public.reviews FOR SELECT
  USING ( true );

-- Authenticated users can insert their own reviews
CREATE POLICY "Authenticated users can insert reviews."
  ON public.reviews FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

