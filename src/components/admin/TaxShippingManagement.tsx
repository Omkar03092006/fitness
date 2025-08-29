import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Plus, Settings } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

interface TaxSetting {
  id: string;
  product_id?: string;
  state: string;
  tax_percentage: number;
  is_default: boolean;
}

interface ShippingSetting {
  id: string;
  product_id?: string;
  state: string;
  shipping_charge: number;
  free_shipping_threshold: number;
  is_default: boolean;
}

interface GlobalSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string;
}

export default function TaxShippingManagement() {
  const { products } = useProducts();
  const [taxSettings, setTaxSettings] = useState<TaxSetting[]>([]);
  const [shippingSettings, setShippingSettings] = useState<ShippingSetting[]>([]);
  const [globalSettings, setGlobalSettings] = useState<GlobalSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newTax, setNewTax] = useState({
    product_id: '',
    state: '',
    tax_percentage: 5,
    is_default: false
  });

  const [newShipping, setNewShipping] = useState({
    product_id: '',
    state: '',
    shipping_charge: 0,
    free_shipping_threshold: 50000,
    is_default: false
  });

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [taxRes, shippingRes, globalRes] = await Promise.all([
        supabase.from('tax_settings').select('*'),
        supabase.from('shipping_settings').select('*'),
        supabase.from('global_settings').select('*')
      ]);

      // Handle errors gracefully - set empty arrays if tables don't exist
      if (taxRes.error) {
        console.error('Tax settings error:', taxRes.error);
        setTaxSettings([]);
      } else {
        setTaxSettings(taxRes.data || []);
      }

      if (shippingRes.error) {
        console.error('Shipping settings error:', shippingRes.error);
        setShippingSettings([]);
      } else {
        setShippingSettings(shippingRes.data || []);
      }

      if (globalRes.error) {
        console.error('Global settings error:', globalRes.error);
        setGlobalSettings([]);
      } else {
        setGlobalSettings(globalRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to fetch settings data");
      // Set empty arrays on error
      setTaxSettings([]);
      setShippingSettings([]);
      setGlobalSettings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addTaxSetting = async () => {
    // Validate required fields
    if (!newTax.state || newTax.tax_percentage <= 0) {
      toast.error("Please fill in all required fields and ensure tax percentage is greater than 0");
      return;
    }

    try {
      const { error } = await supabase
        .from('tax_settings')
        .insert([newTax]);

      if (error) throw error;

      toast.success("Tax setting added successfully");

      setNewTax({
        product_id: '',
        state: '',
        tax_percentage: 5,
        is_default: false
      });

      fetchData();
    } catch (error) {
      console.error('Error adding tax setting:', error);
      toast.error("Failed to add tax setting");
    }
  };

  const addShippingSetting = async () => {
    // Validate required fields
    if (!newShipping.state || newShipping.shipping_charge < 0 || newShipping.free_shipping_threshold < 0) {
      toast.error("Please fill in all required fields and ensure values are valid");
      return;
    }

    try {
      const { error } = await supabase
        .from('shipping_settings')
        .insert([newShipping]);

      if (error) throw error;

      toast.success("Shipping setting added successfully");

      setNewShipping({
        product_id: '',
        state: '',
        shipping_charge: 0,
        free_shipping_threshold: 50000,
        is_default: false
      });

      fetchData();
    } catch (error) {
      console.error('Error adding shipping setting:', error);
      toast.error("Failed to add shipping setting");
    }
  };

  const deleteTaxSetting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tax_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Tax setting deleted successfully");

      fetchData();
    } catch (error) {
      console.error('Error deleting tax setting:', error);
      toast.error("Failed to delete tax setting");
    }
  };

  const deleteShippingSetting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shipping_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Shipping setting deleted successfully");

      fetchData();
    } catch (error) {
      console.error('Error deleting shipping setting:', error);
      toast.error("Failed to delete shipping setting");
    }
  };

  const updateGlobalSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('global_settings')
        .update({ setting_value: value })
        .eq('setting_key', key);

      if (error) throw error;

      toast.success("Global setting updated successfully");

      fetchData();
    } catch (error) {
      console.error('Error updating global setting:', error);
      toast.error("Failed to update global setting");
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  // Helper function to check if table exists
  const checkTableExists = async (tableName: string) => {
    try {
      const { error } = await supabase.from(tableName).select('*').limit(1);
      return !error;
    } catch {
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Tax & Shipping Management</h1>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Global Settings</TabsTrigger>
          <TabsTrigger value="tax">Tax Settings</TabsTrigger>
          <TabsTrigger value="shipping">Shipping Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-4">
          {globalSettings.length === 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-orange-800 mb-4">
                    Global settings table not found. Please ensure the database tables are created.
                  </p>
                  <Button 
                    onClick={() => window.open('https://supabase.com/docs/guides/database/tables', '_blank')}
                    variant="outline"
                  >
                    View Database Setup Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Global Default Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {globalSettings.length > 0 ? globalSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-secondary">
                  <div>
                    <h3 className="font-medium capitalize">
                      {setting.setting_key.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue={setting.setting_value}
                      className="w-20"
                      onBlur={(e) => updateGlobalSetting(setting.setting_key, e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  No global settings available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          {taxSettings.length === 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-orange-800 mb-4">
                    Tax settings table not found. Please ensure the database tables are created.
                  </p>
                  <Button 
                    onClick={() => window.open('https://supabase.com/docs/guides/database/tables', '_blank')}
                    variant="outline"
                  >
                    View Database Setup Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Add Tax Setting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Product (Optional)</Label>
                  <Select value={newTax.product_id} onValueChange={(value) => setNewTax({...newTax, product_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Products</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>State *</Label>
                  <Select value={newTax.state} onValueChange={(value) => setNewTax({...newTax, state: value})}>
                    <SelectTrigger className={!newTax.state ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select State (Required)" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tax Percentage *</Label>
                  <Input
                    type="number"
                    value={newTax.tax_percentage}
                    onChange={(e) => setNewTax({...newTax, tax_percentage: parseFloat(e.target.value) || 0})}
                    placeholder="5.00"
                    min="0"
                    step="0.01"
                    className={newTax.tax_percentage <= 0 ? "border-red-500" : ""}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addTaxSetting} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Tax Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {taxSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-secondary">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">
                          {setting.product_id ? getProductName(setting.product_id) : 'All Products'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {setting.state} • {setting.tax_percentage}% tax
                        </div>
                      </div>
                      {setting.is_default && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTaxSetting(setting.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {taxSettings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No tax settings configured. Default 5% will be applied.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          {shippingSettings.length === 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-orange-800 mb-4">
                    Shipping settings table not found. Please ensure the database tables are created.
                  </p>
                  <Button 
                    onClick={() => window.open('https://supabase.com/docs/guides/database/tables', '_blank')}
                    variant="outline"
                  >
                    View Database Setup Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Add Shipping Setting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label>Product (Optional)</Label>
                  <Select value={newShipping.product_id} onValueChange={(value) => setNewShipping({...newShipping, product_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Products</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>State *</Label>
                  <Select value={newShipping.state} onValueChange={(value) => setNewShipping({...newShipping, state: value})}>
                    <SelectTrigger className={!newShipping.state ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select State (Required)" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Shipping Charge (₹) *</Label>
                  <Input
                    type="number"
                    value={newShipping.shipping_charge}
                    onChange={(e) => setNewShipping({...newShipping, shipping_charge: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className={newShipping.shipping_charge < 0 ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label>Free Shipping Above (₹) *</Label>
                  <Input
                    type="number"
                    value={newShipping.free_shipping_threshold}
                    onChange={(e) => setNewShipping({...newShipping, free_shipping_threshold: parseFloat(e.target.value) || 0})}
                    placeholder="50000"
                    min="0"
                    step="0.01"
                    className={newShipping.free_shipping_threshold < 0 ? "border-red-500" : ""}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addShippingSetting} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Shipping Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {shippingSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-secondary">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">
                          {setting.product_id ? getProductName(setting.product_id) : 'All Products'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {setting.state} • ₹{setting.shipping_charge} shipping • Free above ₹{setting.free_shipping_threshold}
                        </div>
                      </div>
                      {setting.is_default && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteShippingSetting(setting.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {shippingSettings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No shipping settings configured. Default 5% of total will be applied.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}