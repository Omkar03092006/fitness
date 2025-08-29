import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden bg-gradient-card border-fitness-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] transform animate-fade-in">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            {discountPercentage}% OFF
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(4.8)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && (
                <div className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Link to={`/product/${product.id}`} className="flex-1">
              <Button variant="outline" className="w-full hover:bg-gradient-secondary hover:border-primary transition-all duration-300">
                View Details
              </Button>
            </Link>
            <Button
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
              className="flex-shrink-0 bg-gradient-button hover:scale-110 transition-transform shadow-fitness"
              size="icon"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}