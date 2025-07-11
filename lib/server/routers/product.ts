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
      try {
        // Debug log to see what is received
        console.log('Received update payload:', JSON.stringify(input, null, 2));
        
        // If status is IN_EVENT, pickedBy must be present and not empty
        if (
          input.data.status === 'IN_EVENT' &&
          (!input.data.pickedBy || input.data.pickedBy.trim() === '')
        ) {
          throw new Error('pickedBy is required when status is IN_EVENT');
        }
        
        // Get the previous product state
        const prevProduct = await prisma.product.findUnique({ where: { id: input.id } });
        if (!prevProduct) throw new Error('Product not found');

        // Update the product
        const product = await prisma.product.update({
          where: { id: input.id },
          data: input.data,
        });

        // If status changed, log it
        if (input.data.status && input.data.status !== prevProduct.status) {
          await prisma.checkoutLog.create({
            data: {
              productId: input.id,
              status: input.data.status,
              pickedBy: input.data.pickedBy,
              action: 'STATUS_CHANGE',
              previousStatus: prevProduct.status,
              newStatus: input.data.status,
              updatedBy: 'system',
            },
          });
        }
        
        console.log('Product updated successfully:', product);
        return product;
      } catch (error) {
        console.error('Error updating product:', error);
        throw error;
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        // First, delete all associated checkout logs
        await prisma.checkoutLog.deleteMany({
          where: { productId: input.id },
        });
        
        // Then delete the product
        await prisma.product.delete({ where: { id: input.id } });
        
        return { success: true, message: 'Product and associated logs deleted successfully' };
      } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error(`Failed to delete product: ${error.message}`);
      }
    }),

  getAll: publicProcedure
    .query(async () => {
      return prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }),
}); 