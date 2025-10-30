'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Package } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Product {
  id: number;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  category?: string;
  available?: number;
  isActive: boolean;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const isInStock = (product.available ?? 0) > 0;
  const price = (product.priceCents / 100).toFixed(2);

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
              variant="outline"
              disabled={!isInStock}
              className="shrink-0"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}