-- Fix the search path security issues for functions
DROP FUNCTION IF EXISTS public.generate_order_number();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Create function to generate order numbers with proper search path
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Create function to update timestamps with proper search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;