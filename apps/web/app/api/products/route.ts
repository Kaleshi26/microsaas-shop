import { NextResponse } from 'next/server';

const PRODUCTS = [
  {
    id: 1,
    name: 'Premium Leather Backpack',
    description: 'Handcrafted from genuine full-grain leather with laptop compartment.',
    priceCents: 12999,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
    available: 15,
    isActive: true
  },
  {
    id: 2,
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Immersive sound with 30-hour battery life and plush ear cushions.',
    priceCents: 24999,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    available: 8,
    isActive: true
  },
  {
    id: 3,
    name: 'Minimalist Analog Watch',
    description: 'Timeless design with a genuine leather strap and water resistance.',
    priceCents: 8950,
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
    available: 0, // Out of stock test
    isActive: true
  },
  {
    id: 4,
    name: 'Smart Fitness Tracker',
    description: 'Track your steps, heart rate, and sleep with this lightweight device.',
    priceCents: 4999,
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    available: 50,
    isActive: true
  },
  {
    id: 5,
    name: 'Ergonomic Office Chair',
    description: 'Work in comfort with adjustable lumbar support and breathable mesh.',
    priceCents: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80',
    category: 'Furniture',
    available: 5,
    isActive: true
  }
];

export async function GET() {
  return NextResponse.json(PRODUCTS);
}