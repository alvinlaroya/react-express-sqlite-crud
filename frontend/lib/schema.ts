import { z } from 'zod';

export const addOrderSchema = z.object({
  product: z.string().min(1, 'Product name is required').max(100, 'Product name must be less than 100 characters'),
  qty: z.number().int().min(1, 'Quantity must be at least 1').max(1000, 'Quantity must be less than 1000'),
  price: z.number().min(0.01, 'Price must be greater than 0').max(10000, 'Price must be less than $10,000'),
});

export type AddOrderFormData = z.infer<typeof addOrderSchema>;
