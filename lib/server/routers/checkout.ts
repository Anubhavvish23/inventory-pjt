import { router, publicProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { checkoutLogSchema } from '@/lib/types';
import { z } from 'zod';

export const checkoutRouter = router({
  log: publicProcedure
    .input(z.object({
      productId: z.string().uuid(),
      status: z.enum(['AVAILABLE', 'IN_EVENT', 'DEFECTIVE', 'IN_REPAIR', 'MISSING', 'RETIRED']),
      pickedBy: z.string().optional(),
      action: z.string().optional().default('STATUS_CHANGE'),
      previousStatus: z.string().optional(),
      newStatus: z.string().optional(),
      updatedBy: z.string().optional().default('system'),
    }))
    .mutation(async ({ input }) => {
      if (input.status === 'IN_EVENT' && !input.pickedBy) {
        throw new Error('pickedBy is required when status is IN_EVENT');
      }
      const log = await prisma.checkoutLog.create({
        data: input,
      });
      return log;
    }),

  history: publicProcedure
    .input(z.object({ productId: z.string().uuid() }))
    .query(async ({ input }) => {
      const logs = await prisma.checkoutLog.findMany({
        where: { productId: input.productId },
        orderBy: { timestamp: 'desc' },
        include: { product: { select: { name: true } } },
      });
      return logs.map(log => ({
        ...log,
        productName: log.product?.name || '',
      }));
    }),
}); 