import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc-client';
import { useState, useEffect } from 'react';
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

  // Example usage in your component:
  // createProduct.mutate({ name, category, ... })
  // updateProduct.mutate({ id, data: { ... } })
  // deleteProduct.mutate({ id })
  // logCheckout.mutate({ productId, status, pickedBy })

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    logCheckout,
  };
}