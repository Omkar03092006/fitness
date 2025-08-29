import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Shield, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  LogOut,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ProductsManagement from '@/components/admin/ProductsManagement';
import CategoriesManagement from '@/components/admin/CategoriesManagement';
import ContentManagement from '@/components/admin/ContentManagement';
import TaxShippingManagement from '@/components/admin/TaxShippingManagement';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  order_status: string;
  created_at: string;
  order_items: {
    product_name: string;
    quantity: number;
    product_price: number;
    subtotal: number;
  }[];
}

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

export default function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin authentication on mount
  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuthenticated');
    if (isAdmin !== 'true') {
      toast.error('Unauthorized access');
      navigate('/admin-login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders with customer and order items data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          customers (
            name,
            phone,
            email
          ),
          order_items (
            product_name,
            quantity,
            product_price,
            subtotal
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Orders fetch error:', ordersError);
        toast.error('Failed to fetch orders');
      } else {
        const formattedOrders = ordersData?.map(order => ({
          id: order.id,
          order_number: order.order_number,
          customer_name: order.customers?.name || 'N/A',
          customer_phone: order.customers?.phone || 'N/A',
          customer_email: order.customers?.email || 'N/A',
          total_amount: order.total_amount,
          payment_status: order.payment_status,
          payment_method: order.payment_method,
          order_status: order.order_status,
          created_at: order.created_at,
          order_items: order.order_items || []
        })) || [];
        setOrders(formattedOrders);
      }

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Products fetch error:', productsError);
        toast.error('Failed to fetch products');
      } else {
        setProducts(productsData || []);
      }

    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);

      if (error) {
        toast.error('Failed to update order status');
        return;
      }

      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleUpdateProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        // Check if image has changed, if so delete old image
        if (editingProduct.image && productData.image !== editingProduct.image && editingProduct.image.includes('product-images')) {
          await deleteImageFromStorage(editingProduct.image);
        }

        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) {
          toast.error('Failed to update product');
          return;
        }

        toast.success('Product updated successfully');
      } else {
        // Adding new product - ensure all required fields are present
        const requiredFields = {
          id: productData.id!,
          name: productData.name!,
          category: productData.category!,
          price: productData.price!,
          image: productData.image!,
          description: productData.description!,
          in_stock: productData.in_stock ?? true,
          featured: productData.featured ?? false,
          original_price: productData.original_price || null,
        };

        const { error } = await supabase
          .from('products')
          .insert([requiredFields]);

        if (error) {
          toast.error('Failed to add product');
          return;
        }

        toast.success('Product added successfully');
      }

      setEditingProduct(null);
      setIsAddingProduct(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  // Function to delete image from storage
  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      // Only delete if it's a Supabase storage URL
      if (!imageUrl.includes('product-images')) return;
      
      // Extract file path from URL
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

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      // First get the product to delete its image
      const { data: product } = await supabase
        .from('products')
        .select('image')
        .eq('id', productId)
        .single();

      // Delete the image from storage if it exists
      if (product?.image && product.image.includes('product-images')) {
        await deleteImageFromStorage(product.image);
      }

      // Delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        toast.error('Failed to delete product');
        return;
      }

      toast.success('Product deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': case 'delivered': return 'default';
      case 'pending': case 'confirmed': return 'secondary';
      case 'failed': case 'cancelled': return 'destructive';
      case 'shipped': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Capital Fitness Admin</h1>
                <p className="text-sm text-muted-foreground">Equipment Store Management</p>
              </div>
            </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(orders.reduce((sum, order) => sum + order.total_amount, 0))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => order.order_status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="tax-shipping">Tax & Shipping</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders Overview</CardTitle>
                <CardDescription>
                  Manage customer orders, payment status, and order fulfillment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.order_number}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{order.customer_phone}</TableCell>
                          <TableCell>{formatPrice(order.total_amount)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant={getStatusBadgeColor(order.payment_status)}>
                                {order.payment_status}
                              </Badge>
                              <p className="text-xs text-muted-foreground">{order.payment_method}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.order_status}
                              onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Order Details - {order.order_number}</DialogTitle>
                                  <DialogDescription>
                                    Complete order information and items
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium">Customer Information</h4>
                                      <p>Name: {order.customer_name}</p>
                                      <p>Phone: {order.customer_phone}</p>
                                      <p>Email: {order.customer_email}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">Order Information</h4>
                                      <p>Total: {formatPrice(order.total_amount)}</p>
                                      <p>Payment: {order.payment_method}</p>
                                      <p>Status: {order.payment_status}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Order Items</h4>
                                    <div className="space-y-2">
                                      {order.order_items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                                          <div>
                                            <p className="font-medium">{item.product_name}</p>
                                            <p className="text-sm text-muted-foreground">
                                              Qty: {item.quantity} × {formatPrice(item.product_price)}
                                            </p>
                                          </div>
                                          <p className="font-medium">{formatPrice(item.subtotal)}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductsManagement products={products} onRefresh={fetchData} />
          </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <CategoriesManagement />
            </TabsContent>

            {/* Content Tab */}
          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>
          
          <TabsContent value="tax-shipping">
            <TaxShippingManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}