
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export default function Checkout() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'canceled' | 'error'>('idle');
  const { toast } = useToast();

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (success === '1') {
      setOrderStatus('success');
      toast({
        title: 'Payment Successful!',
        description: 'Your order has been processed successfully.',
      });
    } else if (canceled === '1') {
      setOrderStatus('canceled');
      toast({
        title: 'Payment Canceled',
        description: 'Your payment was canceled. You can try again anytime.',
        variant: 'destructive',
      });
    }
  }, [success, canceled, toast]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'customer@example.com', // In a real app, this would come from user auth
          items: [
            {
              productId: 1,
              quantity: 1,
              priceCents: 5900
            }
          ],
          shippingAddress: {
            name: 'John Doe',
            line1: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      setOrderStatus('error');
      toast({
        title: 'Checkout Error',
        description: 'Failed to process checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (orderStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card>
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your purchase. Your order has been processed successfully.
              </p>
              {orderId && (
                <Badge variant="outline" className="mb-6">
                  Order ID: {orderId}
                </Badge>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/products">
                    Continue Shopping
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/profile">
                    View Orders
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (orderStatus === 'canceled') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card>
            <CardContent className="p-8">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Payment Canceled</h1>
              <p className="text-muted-foreground mb-6">
                Your payment was canceled. No charges have been made to your account.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleCheckout} disabled={loading}>
                  Try Again
                </Button>
                <Button asChild variant="outline">
                  <Link href="/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Products
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (orderStatus === 'error') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card>
            <CardContent className="p-8">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Checkout Error</h1>
              <p className="text-muted-foreground mb-6">
                There was an error processing your checkout. Please try again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleCheckout} disabled={loading}>
                  {loading ? 'Processing...' : 'Try Again'}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Products
                  </Link>
                </Button>
              </div>
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
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your purchase securely with Stripe
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Pro Hoodie</h3>
                  <p className="text-sm text-muted-foreground">Cozy dev hoodie</p>
                  <p className="text-sm">Quantity: 1</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$59.00</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span>$59.00</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>$59.00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">
                  This is a demo checkout. Click the button below to proceed with Stripe's secure payment system.
                </p>
                <Button 
                  onClick={handleCheckout} 
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                <p>Powered by Stripe • Secure payment processing</p>
                <p>Your payment information is encrypted and secure</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}