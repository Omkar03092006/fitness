import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  display_order: number;
}

interface AdminCategoryFormProps {
  category?: Category | null;
  onSave: (data: Partial<Category>) => void;
  onCancel: () => void;
}

export default function AdminCategoryForm({ category, onSave, onCancel }: AdminCategoryFormProps) {
  const [formData, setFormData] = useState({
    id: category?.id || '',
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || '',
    display_order: category?.display_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!category && !formData.id) {
      // Generate ID for new category
      formData.id = formData.name.toLowerCase().replace(/\s+/g, '-');
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
            required
          />
        </div>
        <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData(prev => ({...prev, display_order: parseInt(e.target.value) || 0}))}
            min="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
          required
          rows={3}
        />
      </div>

      <ImageUpload
        value={formData.image}
        onChange={(url) => setFormData(prev => ({...prev, image: url}))}
        bucketPath="categories"
        placeholder="Upload category image"
      />

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {category ? 'Update Category' : 'Add Category'}
        </Button>
      </div>
    </form>
  );
}