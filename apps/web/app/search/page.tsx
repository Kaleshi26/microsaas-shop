'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { useToast } from '@/hooks/use-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  category?: string;
  sku?: string;
  isActive: boolean;
  createdAt: string;
  score?: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const searchProducts = async (searchQuery: string, searchFilters = filters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        ...(searchFilters.category && { category: searchFilters.category }),
        ...(searchFilters.minPrice && { minPrice: searchFilters.minPrice }),
        ...(searchFilters.maxPrice && { maxPrice: searchFilters.maxPrice }),
      });

      const response = await fetch(`${API_BASE}/search?${params}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to search products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      searchProducts(query);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(query);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (query) {
      searchProducts(query, newFilters);
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '' });
    if (query) {
      searchProducts(query, { category: '', minPrice: '', maxPrice: '' });
    }
  };

  const categories = [...new Set(results.map(r => r.category).filter(Boolean))];

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
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </form>

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
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
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

      {/* Results */}
      {query && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <p className="text-muted-foreground">
            {isLoading ? 'Searching...' : `${results.length} results found`}
            {query && ` for "${query}"`}
          </p>
        </motion.div>
      )}

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
          {results.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.category && (
                    <Badge className="absolute top-2 left-2">
                      {product.category}
                    </Badge>
                  )}
                  {product.score && (
                    <Badge variant="secondary" className="absolute top-2 right-2">
                      {Math.round(product.score * 100)}% match
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${(product.priceCents / 100).toFixed(2)}
                    </span>
                    <Button size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : query && !isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground mb-4">
                No products found for "{query}". Try adjusting your search terms or filters.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : !query ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Card>
            <CardContent className="p-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Your Search</h3>
              <p className="text-muted-foreground">
                Enter a search term above to find products
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}
    </div>
  );
}
