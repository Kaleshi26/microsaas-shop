'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

// Zod Schema for Validation (Show this off!)
const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  address: z.string().min(5, 'Address is too short'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(5, 'Invalid ZIP code'),
  cardNumber: z.string().min(16, 'Card number must be 16 digits').max(19),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalCents = cart.reduce((acc, item) => acc + item.priceCents, 0);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    clearCart();
    toast({
        title: "Order Placed Successfully!",
        description: `Thank you ${data.firstName}, your order is on the way.`
    });
  };

  if (isSuccess) {
    return (
        <div className="container py-20 flex flex-col items-center justify-center text-center">
            <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
            >
                <CheckCircle className="h-10 w-10" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8">Your order #MS-{Math.floor(Math.random() * 10000)} has been placed.</p>
            <Button asChild size="lg">
                <Link href="/products">Continue Shopping</Link>
            </Button>
        </div>
    );
  }

  if (cart.length === 0) {
    return (
        <div className="container py-20 text-center">
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <Button asChild>
                <Link href="/products">Go to Products</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="container py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Shipping & Payment</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <Input {...register('firstName')} placeholder="John" />
                                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <Input {...register('lastName')} placeholder="Doe" />
                                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input {...register('email')} placeholder="john@example.com" />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <Input {...register('address')} placeholder="123 Main St" />
                            {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City</label>
                                <Input {...register('city')} placeholder="New York" />
                                {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ZIP Code</label>
                                <Input {...register('zipCode')} placeholder="10001" />
                                {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode.message}</p>}
                            </div>
                        </div>

                        <div className="pt-4 border-t mt-4">
                             <label className="text-sm font-medium block mb-2">Card Number (Mock)</label>
                             <Input {...register('cardNumber')} placeholder="0000 0000 0000 0000" />
                             {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber.message}</p>}
                        </div>

                        <Button type="submit" className="w-full mt-6" size="lg" disabled={isProcessing}>
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                </>
                            ) : (
                                `Pay $${(totalCents / 100).toFixed(2)}`
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>

        {/* Order Summary */}
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {cart.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                            <span className="truncate w-32">{item.name}</span>
                            <span>${(item.priceCents/100).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${(totalCents / 100).toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}