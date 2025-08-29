-- Create customers table for storing customer information
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table for storing order information
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  order_number TEXT NOT NULL UNIQUE,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'razorpay', 'card', 'upi')),
  payment_id TEXT, -- Razorpay payment ID
  order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table for storing individual items in each order
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL, -- References the static product ID from products.ts
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table for admin-managed products (replacing static data)
CREATE TABLE public.products (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT NOT NULL,
  images TEXT[],
  description TEXT NOT NULL,
  specifications JSONB,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access (no authentication required for now since we're using localStorage)
CREATE POLICY "Allow full access to customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow full access to orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow full access to order_items" ON public.order_items FOR ALL USING (true);
CREATE POLICY "Allow full access to products" ON public.products FOR ALL USING (true);

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  order_num TEXT;
BEGIN
  -- Generate order number with format: ORD-YYYYMMDD-XXXX
  SELECT 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
         LPAD((EXTRACT(EPOCH FROM NOW())::BIGINT % 10000)::TEXT, 4, '0')
  INTO order_num;
  
  RETURN order_num;
END;
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories and products
INSERT INTO public.products (id, name, category, price, original_price, image, description, in_stock, featured) VALUES
('treadmill-pro', 'Professional Treadmill', 'cardio', 89999.99, 99999.99, '/lovable-uploads/bbb24daf-f7c7-4b82-b3a7-a86194c1309d.png', 'High-performance treadmill with advanced features', true, true),
('dumbbell-set', 'Adjustable Dumbbell Set', 'strength', 15999.99, 18999.99, '/lovable-uploads/bbb24daf-f7c7-4b82-b3a7-a86194c1309d.png', 'Complete adjustable dumbbell set for home gym', true, true),
('yoga-mat', 'Premium Yoga Mat', 'accessories', 2999.99, null, '/lovable-uploads/bbb24daf-f7c7-4b82-b3a7-a86194c1309d.png', 'Non-slip premium yoga mat', true, false),
('resistance-bands', 'Resistance Band Set', 'accessories', 1499.99, 1999.99, '/lovable-uploads/bbb24daf-f7c7-4b82-b3a7-a86194c1309d.png', 'Complete resistance band workout set', true, false);