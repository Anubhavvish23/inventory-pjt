import { z } from 'zod';

export const ProductStatus = [
  'AVAILABLE',
  'IN_EVENT',
  'DEFECTIVE',
  'IN_REPAIR',
  'MISSING',
  'RETIRED',
] as const;

export const productInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  location: z.string().min(1),
  status: z.enum(ProductStatus),
  pickedBy: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.date().optional(),
  value: z.number().optional(),
});

export const productUpdateSchema = productInputSchema.partial();

export const checkoutLogSchema = z.object({
  productId: z.string().uuid(),
  status: z.enum(ProductStatus),
  pickedBy: z.string().optional(),
});

export type ProductStatusType = typeof ProductStatus[number]; 