import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminAboutForm from '@/components/AdminAboutForm';

export default function ContentManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>Manage website content</CardDescription>
      </CardHeader>
      <CardContent>
        <AdminAboutForm />
      </CardContent>
    </Card>
  );
}