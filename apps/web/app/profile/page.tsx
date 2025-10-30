'use client';

import { motion } from 'framer-motion';
import { User, Mail, Calendar, ShoppingBag, LogOut } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Profile() {
  const { user, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-destructive">Error Loading Profile</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading your profile. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card>
            <CardContent className="p-8">
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Welcome to MicroSaaS Shop</h1>
              <p className="text-muted-foreground mb-6">
                Please sign in to view your profile and manage your orders.
              </p>
              <Button asChild size="lg">
                <Link href="/api/auth/login">
                  Sign In
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and view your order history
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.picture} alt={user.name} />
                  <AvatarFallback>
                    {user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>

                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Email Verified</span>
                    <Badge variant={user.email_verified ? 'default' : 'destructive'}>
                      {user.email_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                  
                  {user.updated_at && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>{new Date(user.updated_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/api/auth/logout">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't placed any orders yet. Start shopping to see your order history here.
                </p>
                <Button asChild>
                  <Link href="/products">
                    Start Shopping
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Account Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">User ID</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {user.sub}
                  </code>
                </div>
                
                {user.nickname && (
                  <div>
                    <p className="text-sm font-medium">Nickname</p>
                    <p className="text-sm text-muted-foreground">{user.nickname}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}