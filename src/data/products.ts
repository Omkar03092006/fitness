import { Product, Category } from '@/types/product';

export const categories: Category[] = [
  {
    id: 'chest',
    name: 'Chest',
    description: 'Build a powerful chest with our premium machines',
    image: '/api/placeholder/400/300',
    productCount: 8
  },
  {
    id: 'back',
    name: 'Back',
    description: 'Strengthen your back with professional equipment',
    image: '/api/placeholder/400/300',
    productCount: 6
  },
  {
    id: 'arms',
    name: 'Arms',
    description: 'Sculpt your arms with specialized machines',
    image: '/api/placeholder/400/300',
    productCount: 10
  },
  {
    id: 'legs',
    name: 'Legs',
    description: 'Build powerful legs with heavy-duty equipment',
    image: '/api/placeholder/400/300',
    productCount: 7
  },
  {
    id: 'cardio',
    name: 'Cardio',
    description: 'Premium cardiovascular training equipment',
    image: '/api/placeholder/400/300',
    productCount: 12
  },
  {
    id: 'racks',
    name: 'Racks & Storage',
    description: 'Organize your gym with professional racks',
    image: '/api/placeholder/400/300',
    productCount: 5
  }
];

export const products: Product[] = [
  // Chest Equipment
  {
    id: 'chest-press-basic',
    name: 'Chest Press Machine - Basic',
    category: 'chest',
    price: 45000,
    originalPrice: 55000,
    image: '/api/placeholder/400/400',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400', '/api/placeholder/400/400'],
    description: 'Professional grade chest press machine with adjustable seat and smooth linear bearings. Perfect for commercial and home gyms.',
    specifications: {
      'Weight Stack': '100kg',
      'Dimensions': '150cm x 120cm x 140cm',
      'Max User Weight': '150kg',
      'Warranty': '2 Years'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'chest-press-pro',
    name: 'Chest Press Machine - Professional',
    category: 'chest',
    price: 75000,
    originalPrice: 85000,
    image: '/api/placeholder/400/400',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400'],
    description: 'Heavy-duty chest press with pneumatic assistance and ergonomic design. Built for intensive commercial use.',
    specifications: {
      'Weight Stack': '150kg',
      'Dimensions': '160cm x 130cm x 150cm',
      'Max User Weight': '200kg',
      'Warranty': '3 Years'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'pec-deck',
    name: 'Pec Deck Machine',
    category: 'chest',
    price: 35000,
    image: '/api/placeholder/400/400',
    description: 'Isolated chest fly movement with adjustable arm position and comfortable padding.',
    specifications: {
      'Weight Stack': '80kg',
      'Dimensions': '130cm x 110cm x 140cm',
      'Max User Weight': '120kg',
      'Warranty': '2 Years'
    },
    inStock: true
  },
  {
    id: 'incline-press',
    name: 'Incline Press Machine',
    category: 'chest',
    price: 52000,
    image: '/api/placeholder/400/400',
    description: 'Target upper chest with this premium incline press machine. Multiple grip positions available.',
    inStock: true
  },

  // Cardio Equipment
  {
    id: 'treadmill-3hp',
    name: 'Commercial Treadmill 3HP',
    category: 'cardio',
    price: 85000,
    originalPrice: 95000,
    image: '/api/placeholder/400/400',
    description: 'Professional grade treadmill with 3HP motor, perfect for commercial gyms and serious home users.',
    specifications: {
      'Motor': '3HP Continuous Duty',
      'Speed Range': '1-20 km/h',
      'Running Surface': '50cm x 140cm',
      'Max User Weight': '180kg',
      'Warranty': '3 Years Motor, 1 Year Parts'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'treadmill-4hp',
    name: 'Commercial Treadmill 4HP',
    category: 'cardio',
    price: 125000,
    originalPrice: 140000,
    image: '/api/placeholder/400/400',
    description: 'Heavy-duty 4HP treadmill built for continuous commercial use with advanced console features.',
    specifications: {
      'Motor': '4HP Continuous Duty',
      'Speed Range': '1-25 km/h',
      'Running Surface': '55cm x 150cm',
      'Max User Weight': '220kg',
      'Warranty': '5 Years Motor, 2 Years Parts'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'elliptical-pro',
    name: 'Commercial Elliptical',
    category: 'cardio',
    price: 95000,
    image: '/api/placeholder/400/400',
    description: 'Low-impact full body workout with smooth elliptical motion and multiple resistance levels.',
    inStock: true
  },

  // Back Equipment
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown Machine',
    category: 'back',
    price: 48000,
    image: '/api/placeholder/400/400',
    description: 'Build a strong back with this professional lat pulldown machine featuring multiple grip positions.',
    inStock: true,
    featured: true
  },
  {
    id: 'cable-row',
    name: 'Seated Cable Row',
    category: 'back',
    price: 42000,
    image: '/api/placeholder/400/400',
    description: 'Target your rhomboids and mid-traps with this smooth cable rowing machine.',
    inStock: true
  },

  // Leg Equipment
  {
    id: 'leg-press',
    name: 'Leg Press Machine',
    category: 'legs',
    price: 85000,
    image: '/api/placeholder/400/400',
    description: 'Heavy-duty leg press for building massive leg strength. 45-degree angle for optimal biomechanics.',
    inStock: true,
    featured: true
  },
  {
    id: 'squat-rack',
    name: 'Power Squat Rack',
    category: 'racks',
    price: 65000,
    originalPrice: 75000,
    image: '/api/placeholder/400/400',
    description: 'Professional squat rack with pull-up bar, safety bars, and plate storage.',
    inStock: true,
    featured: true
  }
];

export const featuredProducts = products.filter(p => p.featured);

export const getProductsByCategory = (categoryId: string) => 
  products.filter(p => p.category === categoryId);

export const getProductById = (id: string) => 
  products.find(p => p.id === id);