'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import useSWR from 'swr';

// 1. POINT TO LOCAL MOCK API
const API_BASE = '/api';
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '' });

  // 2. FETCH ALL DATA FIRST
  const { data: allProducts, isLoading } = useSWR(`${API_BASE}/products`, fetcher);

  // 3. FILTER ON CLIENT SIDE
  const results = allProducts?.filter((product: any) => {
    // Search Text Match
    const matchesSearch = !query || 
      product.name.toLowerCase().includes(query.toLowerCase()) || 
      product.description.toLowerCase().includes(query.toLowerCase());

    // Category Match
    const matchesCategory = !filters.category || product.category === filters.category;

    // Price Match
    const price = product.priceCents / 100;
    const matchesMin = !filters.minPrice || price >= Number(filters.minPrice);
    const matchesMax = !filters.maxPrice || price <= Number(filters.maxPrice);

    return matchesSearch && matchesCategory && matchesMin && matchesMax;
  }) || [];

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '' });
    setQuery('');
  };

  const categories = allProducts ? [...new Set(allProducts.map((p: any) => p.category).filter(Boolean))] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">Search Products</h1>
        
        {/* Search Form */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category: any) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Min Price</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Price</label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Results Count */}
      <motion.div className="mb-6">
        <p className="text-muted-foreground">
          {isLoading ? 'Searching...' : `${results.length} results found`}
        </p>
      </motion.div>

      {/* Search Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {results.map((product: any, index: number) => (
            // USING THE SHARED PRODUCT CARD COMPONENT
            <ProductCard key={product.id} product={product} index={index} />
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
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground mb-4">
                No products found. Try adjusting your search terms or filters.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}