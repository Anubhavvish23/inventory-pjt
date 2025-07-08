import { router } from '@/lib/trpc';
import { productRouter } from './product';
import { checkoutRouter } from './checkout';

export const appRouter = router({
  product: productRouter,
  checkout: checkoutRouter,
});

export type AppRouter = typeof appRouter; 