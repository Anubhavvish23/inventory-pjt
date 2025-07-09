-- AlterTable
ALTER TABLE "CheckoutLog" ADD COLUMN     "action" TEXT NOT NULL DEFAULT 'STATUS_CHANGE',
ADD COLUMN     "newStatus" TEXT,
ADD COLUMN     "previousStatus" TEXT,
ADD COLUMN     "updatedBy" TEXT DEFAULT 'system';
