import { Link } from 'react-router-dom';
import { ArrowLeft, Tag, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

export default function Deals() {
  const { products, loading } = useProducts();

  // Filter products with more than 20% discount
  const dealProducts = products.filter(product => {
    if (product.originalPrice && product.price) {
      const discountPercent = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return discountPercent >= 20;
    }
    return false;
  });

  const getDiscountPercent = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading deals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-red-500 text-white">
              <Tag className="h-4 w-4 mr-2" />
              Hot Deals
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Exclusive Fitness Equipment Deals
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Save big on premium fitness equipment with our special deals. 
              All products feature 20% or more discount from original prices.
            </p>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {dealProducts.length > 0 ? (
            <>
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Percent className="h-6 w-6 text-red-500" />
                  <h2 className="text-3xl md:text-4xl font-bold">
                    {dealProducts.length} Amazing Deals Available
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground">
                  Limited time offers on professional-grade equipment
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dealProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} />
                    {product.originalPrice && (
                      <Badge className="absolute top-4 right-4 bg-red-500 text-white z-10">
                        -{getDiscountPercent(product.originalPrice, product.price)}% OFF
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">No deals available right now</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Check back soon for amazing discounts on fitness equipment. 
                In the meantime, browse our full catalog.
              </p>
              <Link to="/categories">
                <Button size="lg">Browse All Equipment</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-fitness-card/30">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Don't Miss Out on These Incredible Savings
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our deals are updated regularly. Follow us or check back often for the latest discounts 
            on premium fitness equipment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/categories">
              <Button variant="outline" size="lg">Browse Categories</Button>
            </Link>
            <Link to="/">
              <Button size="lg">Back to Home</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}