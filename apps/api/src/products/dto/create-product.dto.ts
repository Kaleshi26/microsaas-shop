import { z } from 'zod';

export const CreateProductDtoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  priceCents: z.number().int().min(0, 'Price must be positive'),
  imageUrl: z.string().url('Invalid image URL'),
  category: z.string().optional(),
  sku: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CreateProductDto = z.infer<typeof CreateProductDtoSchema>;
