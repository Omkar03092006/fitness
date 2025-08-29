-- Create categories table with image uploads
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can update categories" 
ON public.categories 
FOR UPDATE 
USING (true);

CREATE POLICY "Admin can delete categories" 
ON public.categories 
FOR DELETE 
USING (true);

-- Insert default categories
INSERT INTO public.categories (id, name, description, display_order) VALUES
('chest', 'Chest', 'Build a powerful chest with our premium machines', 1),
('back', 'Back', 'Strengthen your back with professional equipment', 2),
('arms', 'Arms', 'Sculpt your arms with specialized machines', 3),
('legs', 'Legs', 'Build powerful legs with heavy-duty equipment', 4),
('cardio', 'Cardio', 'Premium cardiovascular training equipment', 5),
('racks', 'Racks & Storage', 'Organize your gym with professional racks', 6);

-- Create about_content table for admin-managed content
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for about_content
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Create policies for about_content
CREATE POLICY "About content is viewable by everyone" 
ON public.about_content 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage about content" 
ON public.about_content 
FOR ALL 
USING (true);

-- Insert default about content
INSERT INTO public.about_content (title, content) VALUES
('About Capital Fitness Equipments', 'Welcome to Capital Fitness Equipments - Your premier destination for professional-grade fitness equipment. We specialize in providing commercial gym equipment and home fitness solutions that meet the highest standards of quality and durability.');

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at
BEFORE UPDATE ON public.about_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();