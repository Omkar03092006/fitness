import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ProductForm from './ProductForm';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price: number | null;
  image: string;
  description: string;
  in_stock: boolean;
  featured: boolean;
}

interface ProductsManagementProps {
  products: Product[];
  onRefresh: () => void;
}

export default function ProductsManagement({ products, onRefresh }: ProductsManagementProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      if (!imageUrl.includes('product-images')) return;
      
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `products/${fileName}`;
      
      const { error } = await supabase.storage
        .from('product-images')
        .remove([filePath]);
      
      if (error) {
        console.error('Error deleting image:', error);
      }
    } catch (error) {
      console.error('Error parsing image URL:', error);
    }
  };

  const handleUpdateProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        const oldImage = editingProduct.image;
        
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) {
          toast.error('Failed to update product');
          return;
        }

        if (oldImage && oldImage !== productData.image && oldImage.includes('product-images')) {
          await deleteImageFromStorage(oldImage);
        }

        toast.success('Product updated successfully');
      } else {
        const requiredFields = {
          id: crypto.randomUUID(),
          name: productData.name!,
          category: productData.category!,
          price: productData.price!,
          image: productData.image!,
          description: productData.description!,
          in_stock: productData.in_stock ?? true,
          featured: productData.featured ?? false,
          original_price: productData.original_price || null,
        };

        const { data, error } = await supabase
          .from('products')
          .insert(requiredFields)
          .select()
          .single();

        if (error) {
          toast.error('Failed to add product');
          return;
        }

        toast.success('Product added successfully');
      }

      setEditingProduct(null);
      setIsAddingProduct(false);
      onRefresh();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { data: product } = await supabase
        .from('products')
        .select('image')
        .eq('id', productId)
        .single();

      if (product?.image && product.image.includes('product-images')) {
        await deleteImageFromStorage(product.image);
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        toast.error('Failed to delete product');
        return;
      }

      toast.success('Product deleted successfully');
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Products Management</CardTitle>
            <CardDescription>Manage your product inventory</CardDescription>
          </div>
          <Button onClick={() => setIsAddingProduct(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div>
                      {formatPrice(product.price)}
                      {product.original_price && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.original_price)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.in_stock ? "default" : "destructive"}>
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.featured ? "default" : "secondary"}>
                      {product.featured ? "Featured" : "Regular"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isAddingProduct || !!editingProduct} onOpenChange={(open) => {
          if (!open) {
            setIsAddingProduct(false);
            setEditingProduct(null);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onSave={handleUpdateProduct}
              onCancel={() => {
                setEditingProduct(null);
                setIsAddingProduct(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}