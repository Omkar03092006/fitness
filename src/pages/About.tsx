import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Users, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface AboutContent {
  id: string;
  title: string;
  content: string;
}

export default function About() {
  const [aboutData, setAboutData] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

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
          id: 'default',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading...</p>
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
          
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {aboutData?.title || 'About Capital Fitness Equipments'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {aboutData?.content || 'Welcome to Capital Fitness Equipments - Your premier destination for professional-grade fitness equipment.'}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Commercial grade equipment built to last with professional warranties
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Expert Team</h3>
                <p className="text-muted-foreground">
                  Experienced professionals to guide you in choosing the right equipment
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Custom Solutions</h3>
                <p className="text-muted-foreground">
                  Tailored fitness solutions for gyms, hotels, and home setups
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Full Service</h3>
                <p className="text-muted-foreground">
                  Installation, maintenance, and after-sales support included
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-fitness-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Story</h2>
            <div className="text-lg text-muted-foreground space-y-6">
              <p>
                Capital Fitness Equipments has been at the forefront of the fitness industry, 
                providing top-quality equipment to gymnasiums, fitness centers, and fitness 
                enthusiasts across the country.
              </p>
              <p>
                Our commitment to excellence and customer satisfaction has made us a trusted 
                partner for thousands of fitness facilities. We specialize in commercial-grade 
                equipment that meets the highest standards of durability and performance.
              </p>
              <p>
                From strength training machines to cardiovascular equipment, we offer a 
                comprehensive range of products to help you build the perfect fitness environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Capital Fitness</h2>
            <p className="text-lg text-muted-foreground">
              We're more than just an equipment supplier - we're your fitness partner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-2">Professional Installation</h4>
                  <p className="text-muted-foreground">
                    Our trained technicians ensure proper setup and installation of all equipment
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-2">Comprehensive Warranty</h4>
                  <p className="text-muted-foreground">
                    Extended warranty coverage and prompt service support across India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-2">Flexible Financing</h4>
                  <p className="text-muted-foreground">
                    Easy EMI options and flexible payment plans for all budgets
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-2">Space Planning</h4>
                  <p className="text-muted-foreground">
                    Free consultation and layout design for optimal space utilization
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-2">Quality Assurance</h4>
                  <p className="text-muted-foreground">
                    All equipment undergoes rigorous testing before delivery
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-2">24/7 Support</h4>
                  <p className="text-muted-foreground">
                    Round-the-clock customer support and maintenance services
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Dream Gym?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let our experts help you choose the perfect equipment for your fitness goals.
            Contact us today for a free consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/categories">
              <Button size="lg">Browse Equipment</Button>
            </Link>
            <Link to="/deals">
              <Button variant="outline" size="lg">View Deals</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}