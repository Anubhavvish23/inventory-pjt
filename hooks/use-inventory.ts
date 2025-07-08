import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc-client';
import { useState } from 'react';
import { Product, CheckoutLog, FilterOptions, ProductStatus } from '@/types/inventory';

export function useInventory() {
  const queryClient = useQueryClient();
  const utils = trpc.useUtils();

  // Fetch all products
  const { data: products = [], isLoading: loading } = trpc.product.getAll.useQuery();

  // Mutations
  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => utils.invalidate(),
  });
  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => utils.invalidate(),
  });
  const deleteProduct = trpc.product.delete.useMutation({
    onSuccess: () => utils.invalidate(),
  });
  const logCheckout = trpc.checkout.log.useMutation({
    onSuccess: () => utils.invalidate(),
  });
  const getHistory = trpc.checkout.history.useQuery;

  // Example usage in your component:
  // createProduct.mutate({ name, category, ... })
  // updateProduct.mutate({ id, data: { ... } })
  // deleteProduct.mutate({ id })
  // logCheckout.mutate({ productId, status, pickedBy })
  // const { data: history } = getHistory({ productId })

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    logCheckout,
    getHistory,
  };
}

export const useInventoryOld = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [checkoutLogs, setCheckoutLogs] = useState<CheckoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setProducts(mockProducts);
      setCheckoutLogs(mockCheckoutLogs);
      setLoading(false);
    }, 1000);
  }, []);

  const filterProducts = (filters: FilterOptions): Product[] => {
    return products.filter(product => {
      if (filters.status && product.status !== filters.status) {
        return false;
      }
      if (filters.location && !product.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.serialNumber?.toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
  };

  const getProductHistory = (productId: string): CheckoutLog[] => {
    return checkoutLogs
      .filter(log => log.productId === productId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const updateProductStatus = (productId: string, newStatus: ProductStatus, pickedBy?: string) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const updatedProduct = {
          ...product,
          status: newStatus,
          pickedBy: newStatus === ProductStatus.IN_EVENT ? pickedBy : undefined,
          updatedAt: new Date()
        };

        // Add to checkout log
        const newLog: CheckoutLog = {
          id: Date.now().toString(),
          productId,
          action: 'STATUS_CHANGE',
          previousStatus: product.status,
          newStatus,
          pickedBy,
          timestamp: new Date(),
          updatedBy: 'current-user'
        };

        setCheckoutLogs(prev => [newLog, ...prev]);

        return updatedProduct;
      }
      return product;
    }));
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, ...updates, updatedAt: new Date() }
        : product
    ));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
    setCheckoutLogs(prev => prev.filter(log => log.productId !== productId));
  };

  return {
    products,
    checkoutLogs,
    loading,
    filterProducts,
    getProductHistory,
    updateProductStatus,
    addProduct,
    updateProduct,
    deleteProduct
  };
};