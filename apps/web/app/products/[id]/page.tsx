'use client';

import { use, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Minus, Plus, ShoppingCart, Star, Shield, Truck, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

// Use local API
const API_URL = '/api/products';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params (Next.js 16 requirement)
  const { id } = use(params);
  
  const { data: products, isLoading } = useSWR(API_URL, fetcher);
  const addToCart = useCartStore((state) => state.addToCart);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  // Find the specific product from the mock list
  const product = products?.find((p: any) => p.id.toString() === id);

  if (isLoading) {
    return (
      <div className="container py-10 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/products" className="text-primary hover:underline">Back to products</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Add item multiple times based on quantity
    for(let i=0; i<quantity; i++) {
        addToCart(product);
    }
    toast({
      title: "Added to cart",
      description: `Added ${quantity} ${product.name}(s) to your cart.`
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-6xl">
        {/* Breadcrumb / Back */}
        <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Image Section */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative aspect-square bg-muted rounded-2xl overflow-hidden border"
            >
                <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
                {product.category && (
                    <Badge className="absolute top-4 left-4 text-lg py-1">{product.category}</Badge>
                )}
            </motion.div>

            {/* Details Section */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{product.name}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-primary">
                            ${(product.priceCents / 100).toFixed(2)}
                        </span>
                        {product.available > 0 ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                                <Check className="h-3 w-3 mr-1" /> In Stock
                            </Badge>
                        ) : (
                            <Badge variant="destructive">Out of Stock</Badge>
                        )}
                    </div>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed">
                    {product.description}
                </p>

                {/* Features (Mocked for visual appeal) */}
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Truck className="h-4 w-4" /> Free Shipping
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" /> 2 Year Warranty
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="h-4 w-4" /> 30 Day Returns
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-yellow-500" /> 4.9/5 Rating
                    </div>
                </div>

                <div className="pt-6 border-t space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="font-medium">Quantity:</span>
                        <div className="flex items-center border rounded-md">
                            <Button 
                                variant="ghost" size="icon" 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{quantity}</span>
                            <Button 
                                variant="ghost" size="icon" 
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <Button 
                        size="lg" 
                        className="w-full text-lg h-14" 
                        onClick={handleAddToCart}
                        disabled={product.available === 0}
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                    </Button>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}