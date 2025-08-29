import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform database format to Product type format
      const transformedProducts = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.original_price || undefined,
        image: product.image,
        images: product.images || undefined,
        description: product.description,
        specifications: product.specifications as Record<string, string> | undefined,
        inStock: product.in_stock,
        featured: product.featured || false
      }));
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProductsByCategory(category: string) {
  const { products, loading, error } = useProducts();
  const filteredProducts = products.filter(p => p.category === category);
  return { products: filteredProducts, loading, error };
}

export function useFeaturedProducts() {
  const { products, loading, error } = useProducts();
  const featuredProducts = products.filter(p => p.featured);
  return { products: featuredProducts, loading, error };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        // Transform database format to Product type format
        const transformedProduct = data ? {
          id: data.id,
          name: data.name,
          category: data.category,
          price: data.price,
          originalPrice: data.original_price || undefined,
          image: data.image,
          images: data.images || undefined,
          description: data.description,
          specifications: data.specifications as Record<string, string> | undefined,
          inStock: data.in_stock,
          featured: data.featured || false
        } : null;
        
        setProduct(transformedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { products } = useProducts();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        // Add product counts from database
        const categoriesWithCounts = (data || []).map(category => ({
          ...category,
          productCount: products.filter(p => p.category === category.id).length,
          image: category.image || '/api/placeholder/400/300'
        }));
        
        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories
        const defaultCategories = [
          { id: 'chest', name: 'Chest', description: 'Build a powerful chest with our premium machines', image: '/api/placeholder/400/300' },
          { id: 'back', name: 'Back', description: 'Strengthen your back with professional equipment', image: '/api/placeholder/400/300' },
          { id: 'arms', name: 'Arms', description: 'Sculpt your arms with specialized machines', image: '/api/placeholder/400/300' },
          { id: 'legs', name: 'Legs', description: 'Build powerful legs with heavy-duty equipment', image: '/api/placeholder/400/300' },
          { id: 'cardio', name: 'Cardio', description: 'Premium cardiovascular training equipment', image: '/api/placeholder/400/300' },
          { id: 'racks', name: 'Racks & Storage', description: 'Organize your gym with professional racks', image: '/api/placeholder/400/300' }
        ];
        const categoriesWithCounts = defaultCategories.map(category => ({
          ...category,
          productCount: products.filter(p => p.category === category.id).length
        }));
        setCategories(categoriesWithCounts);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [products]);

  return categories;
}