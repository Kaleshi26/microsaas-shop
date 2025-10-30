import { z } from 'zod';

export const UpdateProductDtoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long').optional(),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long').optional(),
  priceCents: z.number().int().min(0, 'Price must be positive').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  category: z.string().optional(),
  sku: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>;
