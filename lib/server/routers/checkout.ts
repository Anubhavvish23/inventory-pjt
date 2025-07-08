import { router, publicProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { checkoutLogSchema } from '@/lib/types';
import { z } from 'zod';

export const checkoutRouter = router({
  log: publicProcedure
    .input(checkoutLogSchema)
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
      });
      return logs;
    }),
}); 