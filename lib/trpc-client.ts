import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/lib/server/routers/app';

export const trpc = createTRPCReact<AppRouter>(); 