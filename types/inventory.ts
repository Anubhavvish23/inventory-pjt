export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  status: ProductStatus;
  pickedBy?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  value?: number;
  createdAt: Date;
  updatedAt: Date;
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
  action: 'CHECKOUT' | 'RETURN' | 'STATUS_CHANGE';
  previousStatus: ProductStatus;
  newStatus: ProductStatus;
  pickedBy?: string;
  location?: string;
  notes?: string;
  timestamp: Date;
  updatedBy: string;
}

export interface FilterOptions {
  status?: ProductStatus;
  location?: string;
  search?: string;
}