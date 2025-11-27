'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Package, Check } from 'lucide-react'; // Added Check icon
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCartStore, Product } from '@/lib/store'; // Import store
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast'; // Assuming you have this from file tree

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const isInStock = (product.available ?? 0) > 0;
  const price = (product.priceCents / 100).toFixed(2);
  
  // Logic hooks
  const addToCart = useCartStore((state) => state.addToCart);
  const { toast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent triggering the Link if wrapped
    
    addToCart(product);
    
    // Visual feedback
    setIsAdded(true);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.category && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2"
            >
              {product.category}
            </Badge>
          )}
          {!isInStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-primary">
              ${price}
            </span>
            {isInStock && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Package className="h-4 w-4 mr-1" />
                {product.available} left
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex w-full gap-2">
            <Button 
              asChild 
              className="flex-1" 
              disabled={!isInStock}
            >
              <Link href={`/products/${product.id}`}>
                View Details
              </Link>
            </Button>
            <Button 
              size="icon" 
              variant={isAdded ? "default" : "outline"} // Change style on add
              disabled={!isInStock}
              className="shrink-0 transition-all duration-300"
              onClick={handleAddToCart}
            >
              {isAdded ? (
                <Check className="h-4 w-4" /> 
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}