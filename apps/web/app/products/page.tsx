'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, RefreshCw } from 'lucide-react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import SearchBar from '@/components/SearchBar';
import { useToast } from '@/hooks/use-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { toast } = useToast();

  const { data: products, error, isLoading, mutate } = useSWR(`${API_BASE}/products`, fetcher);

  const categories = products ? [...new Set(products.map((p: any) => p.category).filter(Boolean))] : [];
  const filteredProducts = products?.filter((product: any) => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleReindex = async () => {
    try {
      await fetch(`${API_BASE}/products/reindex`, { method: 'POST' });
      toast({
        title: 'Success',
        description: 'Products have been reindexed successfully!',
      });
      mutate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reindex products. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-destructive">Error Loading Products</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading the products. Please try again.
            </p>
            <Button onClick={() => mutate()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Discover our amazing collection of products
            </p>
          </div>
          <Button onClick={handleReindex} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reindex Search
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search products..."
              onSearch={setSearchQuery}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <p className="text-muted-foreground">
          {isLoading ? 'Loading...' : `${filteredProducts.length} products found`}
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory && ` in ${selectedCategory}`}
        </p>
      </motion.div>

      {/* Products Grid/List */}
      {isLoading ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}
        >
          {filteredProducts.map((product: any, index: number) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory
                  ? 'Try adjusting your search or filters'
                  : 'No products are available at the moment'
                }
              </p>
              {(searchQuery || selectedCategory) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}