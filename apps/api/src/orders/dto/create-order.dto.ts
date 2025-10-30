import { z } from 'zod';

export const CreateOrderDtoSchema = z.object({
  email: z.string().email('Invalid email address'),
  items: z.array(z.object({
    productId: z.number().int().positive('Product ID must be positive'),
    quantity: z.number().int().positive('Quantity must be positive'),
    priceCents: z.number().int().positive('Price must be positive'),
  })).min(1, 'At least one item is required'),
  shippingAddress: z.object({
    name: z.string().min(1, 'Name is required'),
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }).optional(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderDtoSchema>;
