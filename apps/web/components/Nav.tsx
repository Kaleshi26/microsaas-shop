'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ui/theme-toggle';

export default function Nav() {
  const { user, isLoading } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/products', label: 'Products' },
    { href: '/search', label: 'Search' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            MicroSaaS Shop
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center space-x-2">
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/api/auth/logout">
                <Button variant="outline" size="sm">
                  Logout
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/api/auth/login">
              <Button size="sm">Login</Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t bg-background"
        >
          <div className="px-4 py-2 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}