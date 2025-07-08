"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  MapPin,
} from 'lucide-react';
import { useInventory } from '@/hooks/use-inventory';
import { ProductStatus } from '@/types/inventory';
import { statusConfig, formatCurrency, formatDate } from '@/lib/inventory-utils';

export default function DashboardPage() {
  const { products, loading } = useInventory();
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    inEvent: 0,
    defective: 0,
    inRepair: 0,
    missing: 0,
    retired: 0,
    totalValue: 0,
  });

  useEffect(() => {
    if (!loading && products.length > 0) {
      const newStats = {
        total: products.length,
        available: products.filter(p => p.status === ProductStatus.AVAILABLE).length,
        inEvent: products.filter(p => p.status === ProductStatus.IN_EVENT).length,
        defective: products.filter(p => p.status === ProductStatus.DEFECTIVE).length,
        inRepair: products.filter(p => p.status === ProductStatus.IN_REPAIR).length,
        missing: products.filter(p => p.status === ProductStatus.MISSING).length,
        retired: products.filter(p => p.status === ProductStatus.RETIRED).length,
        totalValue: products.reduce((sum, p) => sum + (p.value || 0), 0),
      };
      setStats(newStats);
    }
  }, [products, loading]);

  const recentActivity = products
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const locationStats = products.reduce((acc, product) => {
    acc[product.location] = (acc[product.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(locationStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Overview of your inventory management system
            </p>
          </div>
          <Button>
            <TrendingUp className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Across all categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <p className="text-xs text-muted-foreground">
                Ready for use
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Use</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.inEvent}</div>
              <p className="text-xs text-muted-foreground">
                Currently checked out
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Asset valuation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>
                Current status breakdown of all products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.values(ProductStatus).map((status) => {
                const count = stats[status.toLowerCase().replace(/[^a-z]/g, '') as keyof typeof stats] as number;
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                const statusInfo = statusConfig[status];

                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`${statusInfo.color} px-2 py-1 text-xs`}>
                          {statusInfo.icon} {status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {count} items
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Locations</CardTitle>
              <CardDescription>
                Most used storage locations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topLocations.map(([location, count]) => (
                <div key={location} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{location}</span>
                  </div>
                  <Badge variant="secondary">{count} items</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates to your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((product) => {
                const statusInfo = statusConfig[product.status];
                return (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.category} • {product.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${statusInfo.color} mb-1`}>
                        {statusInfo.icon} {product.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(product.updatedAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}