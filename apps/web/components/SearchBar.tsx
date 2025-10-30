'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface SearchSuggestion {
  id: string;
  name: string;
  category?: string;
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ 
  placeholder = "Search products...", 
  className = "",
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length > 1) {
      setIsLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          setSuggestions(data.suggestions || []);
          setIsOpen(true);
        } catch (error) {
          console.error('Search suggestions error:', error);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name);
    handleSearch(suggestion.name);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (suggestions.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-1"
          >
            <Card className="shadow-lg">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2" />
                    Searching...
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Clock className="h-4 w-4 text-muted-foreground mr-3" />
                        <div className="flex-1">
                          <div className="font-medium">{suggestion.name}</div>
                          {suggestion.category && (
                            <div className="text-sm text-muted-foreground">
                              {suggestion.category}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No suggestions found
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
