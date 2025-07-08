"use client";

import { useState } from 'react';
import { Product, ProductStatus } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { statusConfig } from '@/lib/inventory-utils';

interface StatusUpdateModalProps {
  product: Product;
  onUpdate: (status: ProductStatus, pickedBy?: string) => void;
  onCancel: () => void;
}

export function StatusUpdateModal({ product, onUpdate, onCancel }: StatusUpdateModalProps) {
  const [status, setStatus] = useState<ProductStatus>(product.status);
  const [pickedBy, setPickedBy] = useState(product.pickedBy || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (status === ProductStatus.IN_EVENT && !pickedBy.trim()) {
      setError('Picked by is required when status is In-Event');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onUpdate(status, pickedBy.trim() || undefined);
    setIsSubmitting(false);
  };

  const currentStatusInfo = statusConfig[product.status];
  const newStatusInfo = statusConfig[status];

  return (
    <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Update Product Status</DialogTitle>
        <DialogDescription>
          Change the status of "{product.name}" and track any necessary information.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Current Status</h4>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatusInfo.color}`}>
              {currentStatusInfo.icon} {product.status}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentStatusInfo.description}
            </span>
          </div>
          {product.pickedBy && (
            <p className="text-sm text-muted-foreground mt-2">
              Currently with: {product.pickedBy}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ProductStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ProductStatus).map((statusOption) => {
                  const statusInfo = statusConfig[statusOption];
                  return (
                    <SelectItem key={statusOption} value={statusOption}>
                      <div className="flex items-center gap-2">
                        <span>{statusInfo.icon}</span>
                        <span>{statusOption}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {status === ProductStatus.IN_EVENT && (
            <div className="space-y-2">
              <Label htmlFor="pickedBy">Picked By *</Label>
              <Input
                id="pickedBy"
                value={pickedBy}
                onChange={(e) => setPickedBy(e.target.value)}
                placeholder="Enter person's name"
                className={error ? 'border-red-500' : ''}
              />
              <p className="text-sm text-muted-foreground">
                Required when status is set to In-Event
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {status !== product.status && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <h4 className="font-medium text-blue-900 mb-1">Status Change Preview</h4>
              <div className="flex items-center gap-2 text-sm">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${currentStatusInfo.color}`}>
                  {currentStatusInfo.icon} {product.status}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${newStatusInfo.color}`}>
                  {newStatusInfo.icon} {status}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || status === product.status}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}