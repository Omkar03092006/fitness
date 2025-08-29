-- Create table for tax configurations
CREATE TABLE public.tax_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  state TEXT,
  tax_percentage DECIMAL(5,2) DEFAULT 5.00,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for shipping configurations
CREATE TABLE public.shipping_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  state TEXT,
  shipping_charge DECIMAL(10,2) DEFAULT 0,
  free_shipping_threshold DECIMAL(10,2) DEFAULT 50000,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for global settings
CREATE TABLE public.global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.global_settings (setting_key, setting_value, description) VALUES
('default_tax_percentage', '5.00', 'Default tax percentage when no specific tax is configured'),
('default_shipping_charge', '5.00', 'Default shipping charge percentage when no specific shipping is configured'),
('gst_rate', '18.00', 'GST rate for India');

-- Enable RLS
ALTER TABLE public.tax_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for tax_settings
CREATE POLICY "Tax settings are viewable by everyone" ON public.tax_settings FOR SELECT USING (true);
CREATE POLICY "Admin can manage tax settings" ON public.tax_settings FOR ALL USING (true);

-- Create policies for shipping_settings
CREATE POLICY "Shipping settings are viewable by everyone" ON public.shipping_settings FOR SELECT USING (true);
CREATE POLICY "Admin can manage shipping settings" ON public.shipping_settings FOR ALL USING (true);

-- Create policies for global_settings
CREATE POLICY "Global settings are viewable by everyone" ON public.global_settings FOR SELECT USING (true);
CREATE POLICY "Admin can manage global settings" ON public.global_settings FOR ALL USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_tax_settings_updated_at
  BEFORE UPDATE ON public.tax_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipping_settings_updated_at
  BEFORE UPDATE ON public.shipping_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_global_settings_updated_at
  BEFORE UPDATE ON public.global_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();