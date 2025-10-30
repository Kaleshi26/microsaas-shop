import { z } from 'zod';

export const OrderResponseDtoSchema = z.object({
  id: z.number(),
  email: z.string(),
  amountCents: z.number(),
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  stripeSessionId: z.string().nullable(),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number(),
    priceCents: z.number(),
  })),
  shippingAddress: z.object({
    name: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type OrderResponseDto = z.infer<typeof OrderResponseDtoSchema>;
