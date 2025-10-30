import { z } from 'zod';

export const ProductResponseDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  priceCents: z.number(),
  imageUrl: z.string(),
  category: z.string().nullable(),
  sku: z.string().nullable(),
  isActive: z.boolean(),
  available: z.number().optional(), // Stock availability from inventory service
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProductResponseDto = z.infer<typeof ProductResponseDtoSchema>;
