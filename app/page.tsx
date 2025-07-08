"use client";

import { useState } from 'react';
import { Product, FilterOptions } from '@/types/inventory';
import { useInventory } from '@/hooks/use-inventory';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Package, AlertCircle } from 'lucide-react';
import { ProductCard } from '@/components/inventory/product-card';
import { ProductForm } from '@/components/inventory/product-form';
import { StatusUpdateModal } from '@/components/inventory/status-update-modal';
import { HistoryModal } from '@/components/inventory/history-modal';
import { InventoryFilters } from '@/components/inventory/inventory-filters';

export default function InventoryPage() {
  const {
    products,
    loading,
    getProductHistory,
    updateProductStatus,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useInventory();

  const [filters, setFilters] = useState<FilterOptions>({});
  const [modals, setModals] = useState({
    addProduct: false,
    editProduct: false,
    statusUpdate: false,
    history: false,
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const filteredProducts = products.filter((product) => {
    let matches = true;
    if (filters.status && product.status !== filters.status) matches = false;
    if (filters.location && product.location !== filters.location) matches = false;
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) matches = false;
    return matches;
  });

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModals(prev => ({ ...prev, addProduct: true }));
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setModals(prev => ({ ...prev, editProduct: true }));
  };

  const handleStatusUpdate = (product: Product) => {
    setSelectedProduct(product);
    setModals(prev => ({ ...prev, statusUpdate: true }));
  };

  const handleViewHistory = (productId: string) => {
    setSelectedProductId(productId);
    setModals(prev => ({ ...prev, history: true }));
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate({ id: productId });
    }
  };

  const closeModals = () => {
    setModals({
      addProduct: false,
      editProduct: false,
      statusUpdate: false,
      history: false,
    });
    setSelectedProduct(null);
    setSelectedProductId(null);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProduct) {
      updateProduct.mutate({ id: selectedProduct.id, data: productData });
    } else {
      createProduct.mutate(productData);
    }
    closeModals();
  };

  const handleUpdateStatus = (status: any, pickedBy?: string) => {
    if (selectedProduct) {
      updateProduct.mutate({
        id: selectedProduct.id,
        data: { status, pickedBy }
      });
    }
    closeModals();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Inventory Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Track and manage your equipment inventory
            </p>
          </div>
          <Button onClick={handleAddProduct} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
          <InventoryFilters
            onFilterChange={setFilters}
            totalProducts={products.length}
            filteredCount={filteredProducts.length}
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              {Object.keys(filters).some(key => filters[key as keyof FilterOptions]) ? (
                <AlertCircle className="w-12 h-12 text-gray-400" />
              ) : (
                <Package className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {Object.keys(filters).some(key => filters[key as keyof FilterOptions])
                ? 'No products match your filters'
                : 'No products in inventory'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {Object.keys(filters).some(key => filters[key as keyof FilterOptions])
                ? 'Try adjusting your search criteria or clear the filters'
                : 'Get started by adding your first product to the inventory'
              }
            </p>
            {!Object.keys(filters).some(key => filters[key as keyof FilterOptions]) && (
              <Button onClick={handleAddProduct} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Product
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onStatusUpdate={handleStatusUpdate}
                onViewHistory={handleViewHistory}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <Dialog open={modals.addProduct || modals.editProduct} onOpenChange={closeModals}>
          <ProductForm
            product={selectedProduct || undefined}
            onSave={handleSaveProduct}
            onCancel={closeModals}
          />
        </Dialog>

        <Dialog open={modals.statusUpdate} onOpenChange={closeModals}>
          {selectedProduct && (
            <StatusUpdateModal
              product={selectedProduct}
              onUpdate={handleUpdateStatus}
              onCancel={closeModals}
            />
          )}
        </Dialog>

        <Dialog open={modals.history} onOpenChange={closeModals}>
          {selectedProductId && (
            <HistoryModal
              productName={
                products.find(p => p.id === selectedProductId)?.name || 'Unknown Product'
              }
              history={getProductHistory(selectedProductId)}
              onClose={closeModals}
            />
          )}
        </Dialog>
      </div>
    </div>
  );
}