import { ProductStatus } from '@/types/inventory';

export const statusConfig = {
  [ProductStatus.AVAILABLE]: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '✓',
    description: 'Ready for use'
  },
  [ProductStatus.IN_EVENT]: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '📅',
    description: 'Currently in use'
  },
  [ProductStatus.DEFECTIVE]: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '⚠️',
    description: 'Needs attention'
  },
  [ProductStatus.IN_REPAIR]: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '🔧',
    description: 'Being repaired'
  },
  [ProductStatus.MISSING]: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '❓',
    description: 'Location unknown'
  },
  [ProductStatus.RETIRED]: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '📦',
    description: 'Out of service'
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date: Date | string | undefined | null): string => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date | string | undefined | null): string => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return '-';
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};