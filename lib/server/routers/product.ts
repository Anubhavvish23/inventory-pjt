import { router, publicProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { productInputSchema, productUpdateSchema, ProductStatus } from '@/lib/types';
import { z } from 'zod';

export const productRouter = router({
  create: publicProcedure
    .input(productInputSchema)
    .mutation(async ({ input }) => {
      const product = await prisma.product.create({
        data: input,
      });
      return product;
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: productUpdateSchema,
    }))
    .mutation(async ({ input }) => {
      // If status is IN_EVENT, pickedBy must be present
      if (
        input.data.status === 'IN_EVENT' &&
        (!('pickedBy' in input.data) || !input.data.pickedBy)
      ) {
        throw new Error('pickedBy is required when status is IN_EVENT');
      }
      const product = await prisma.product.update({
        where: { id: input.id },
        data: input.data,
      });
      return product;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await prisma.product.delete({ where: { id: input.id } });
      return { success: true };
    }),

  getAll: publicProcedure
    .query(async () => {
      return prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }),
}); 