export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  status: ProductStatus | string;
  pickedBy?: string | null;
  serialNumber?: string | null;
  purchaseDate?: Date | string | null;
  value?: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  IN_EVENT = 'IN_EVENT',
  DEFECTIVE = 'DEFECTIVE',
  IN_REPAIR = 'IN_REPAIR',
  MISSING = 'MISSING',
  RETIRED = 'RETIRED'
}

export interface CheckoutLog {
  id: string;
  productId: string;
  action: string;
  previousStatus: ProductStatus | string | null;
  newStatus: ProductStatus | string | null;
  pickedBy?: string | null;
  timestamp: Date | string;
  updatedBy: string | null;
  status: string;
}

export interface FilterOptions {
  status?: ProductStatus;
  location?: string;
  search?: string;
}