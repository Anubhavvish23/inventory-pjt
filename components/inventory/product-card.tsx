"use client";

import { useState } from 'react';
import { Product, ProductStatus } from '@/types/inventory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { statusConfig, formatCurrency, formatDate } from '@/lib/inventory-utils';
import { Edit, History, MoreVertical, Trash2, RefreshCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onStatusUpdate: (product: Product) => void;
  onViewHistory: (productId: string) => void;
}

export function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  onStatusUpdate, 
  onViewHistory 
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const statusInfo = statusConfig[product.status];

  const handleAction = async (action: () => void) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
    action();
    setIsLoading(false);
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">
              {product.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {product.category} • {product.serialNumber}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAction(() => onEdit(product))}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction(() => onStatusUpdate(product))}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Update Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction(() => onViewHistory(product.id))}>
                <History className="mr-2 h-4 w-4" />
                View History
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleAction(() => onDelete(product.id))}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {product.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge 
              variant="secondary" 
              className={`${statusInfo.color} border px-2 py-1 text-xs font-medium whitespace-nowrap`}
            >
              {statusInfo.icon} {product.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Location:</span>
            <span className="text-sm text-muted-foreground text-right flex-1 ml-2 truncate">
              {product.location}
            </span>
          </div>

          {product.pickedBy && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Picked by:</span>
              <span className="text-sm text-muted-foreground text-right flex-1 ml-2 truncate">
                {product.pickedBy}
              </span>
            </div>
          )}

          {product.value && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Value:</span>
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency(product.value)}
              </span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Added:</span>
              <span>{formatDate(product.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Updated:</span>
              <span>{formatDate(product.updatedAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>

      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
    </Card>
  );
}