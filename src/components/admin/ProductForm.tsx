import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from '@/components/ImageUpload';

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

interface ProductFormProps {
  product: Product | null;
  onSave: (data: Partial<Product>) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    id: product?.id || '',
    name: product?.name || '',
    category: product?.category || 'cardio',
    price: product?.price || 0,
    original_price: product?.original_price || null,
    image: product?.image || '',
    description: product?.description || '',
    in_stock: product?.in_stock ?? true,
    featured: product?.featured ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image || formData.price <= 0) {
      alert('Please fill all required fields');
      return;
    }
    onSave(formData);
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData({ ...formData, image: imageUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cardio">Cardio</SelectItem>
            <SelectItem value="strength">Strength</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="weights">Weights</SelectItem>
            <SelectItem value="recovery">Recovery</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="original_price">Original Price (₹)</Label>
          <Input
            id="original_price"
            type="number"
            value={formData.original_price || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              original_price: e.target.value ? parseFloat(e.target.value) : null 
            })}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <Label>Product Image *</Label>
        <ImageUpload
          value={formData.image}
          onChange={handleImageUpload}
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="in_stock"
            checked={formData.in_stock}
            onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
          />
          <Label htmlFor="in_stock">In Stock</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          />
          <Label htmlFor="featured">Featured Product</Label>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit">
          {product ? 'Update' : 'Add'} Product
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}