import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import { useFeaturedProducts, useCategories } from '@/hooks/useProducts';
import heroImage from '@/assets/gym-hero.jpg';

const searchSuggestions = [
  'Treadmill', 'Chest Press Machine', 'Squat Rack', 'Dumbbells',
  'Leg Press', 'Cable Machine', 'Elliptical', 'Bench Press'
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  
  const { products: featuredProducts, loading: loadingFeatured } = useFeaturedProducts();
  const categories = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Professional gym equipment"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Welcome to Capital Fitness Equipments
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional grade fitness equipment for commercial gyms and home fitness enthusiasts. 
              Build your dream gym with premium quality machines.
            </p>
            
            {/* Hero Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="h-14 pr-14 text-lg bg-background/90 backdrop-blur-sm border-fitness-border"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-2 top-2 h-10 w-10"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </form>
              
              {/* Search Suggestions */}
              {showSuggestions && searchQuery && (
                <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-md mt-1 shadow-lg z-50">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                          setShowSuggestions(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-muted transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-muted-foreground">No suggestions found</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/categories">
                <Button variant="hero" size="lg">
                  Browse Categories
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/deals">
                <Button variant="outline" size="lg">
                  View Deals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-fitness-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-muted-foreground">
              Find equipment organized by muscle group and training type
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card className="group overflow-hidden bg-card border-fitness-border hover:shadow-card transition-all duration-300 hover:-translate-y-2">
                  <div className="relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.productCount} items
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary text-primary-foreground">Featured</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Premium Equipment
            </h2>
            <p className="text-xl text-muted-foreground">
              Hand-picked professional grade equipment for serious training
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingFeatured ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg animate-pulse h-96"></div>
              ))
            ) : (
              featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/categories">
              <Button variant="outline" size="lg">
                View All Equipment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-fitness-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Premium Quality</h3>
              <p className="text-muted-foreground">
                Commercial grade equipment built to last with professional warranties
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <ArrowRight className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Free Installation</h3>
              <p className="text-muted-foreground">
                Professional installation and setup service included with every purchase
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Expert Support</h3>
              <p className="text-muted-foreground">
                Dedicated support team to help you choose the right equipment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Access Footer */}
      <footer className="py-8 bg-fitness-card/30 border-t border-fitness-border">
        <div className="container mx-auto px-4 text-center">
          <Link 
            to="/admin-login" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Star className="h-4 w-4 mr-2" />
            Admin Access
          </Link>
        </div>
      </footer>
    </div>
  );
}