import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AboutContent {
  id: string;
  title: string;
  content: string;
}

export default function AdminAboutForm() {
  const [aboutData, setAboutData] = useState<AboutContent>({
    id: '',
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching about content:', error);
        // Use default content if database query fails
        setAboutData({
          id: '',
          title: 'About Capital Fitness Equipments',
          content: 'Welcome to Capital Fitness Equipments - Your premier destination for professional-grade fitness equipment.'
        });
      } else {
        setAboutData(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aboutData.title || !aboutData.content) {
      toast.error('Please fill in all fields');
      return;
    }

    setSaving(true);

    try {
      if (aboutData.id) {
        // Update existing content
        const { error } = await supabase
          .from('about_content')
          .update({
            title: aboutData.title,
            content: aboutData.content
          })
          .eq('id', aboutData.id);

        if (error) throw error;
      } else {
        // Insert new content (delete any existing first)
        await supabase.from('about_content').delete().neq('id', '0'); // Delete all existing
        
        const { data, error } = await supabase
          .from('about_content')
          .insert([{
            title: aboutData.title,
            content: aboutData.content
          }])
          .select()
          .single();

        if (error) throw error;
        setAboutData(data);
      }

      toast.success('About content updated successfully');
    } catch (error) {
      console.error('Error saving about content:', error);
      toast.error('Failed to save about content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading content...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Page Title *</Label>
        <Input
          id="title"
          value={aboutData.title}
          onChange={(e) => setAboutData(prev => ({...prev, title: e.target.value}))}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={aboutData.content}
          onChange={(e) => setAboutData(prev => ({...prev, content: e.target.value}))}
          required
          rows={10}
          placeholder="Enter the about page content here..."
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save About Content'}
        </Button>
      </div>
    </form>
  );
}