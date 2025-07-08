"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  FileText,
  Calendar,
  Filter,
  TrendingUp,
  Package,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useInventory } from '@/hooks/use-inventory';
import { ProductStatus } from '@/types/inventory';
import { statusConfig, formatCurrency, formatDate } from '@/lib/inventory-utils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function ReportsPage() {
  const { products, checkoutLogs } = useInventory();
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [showRaw, setShowRaw] = useState(false);

  // Prepare chart data
  const statusData = Object.values(ProductStatus).map((status) => ({
    name: status,
    value: products.filter(p => p.status === status).length,
    color: statusConfig[status].color,
  }));

  const categoryData = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
    name: category,
    value: count,
  }));

  const locationData = products.reduce((acc, product) => {
    acc[product.location] = (acc[product.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationChartData = Object.entries(locationData).map(([location, count]) => ({
    name: location,
    value: count,
  }));

  const valueByCategory = products.reduce((acc, product) => {
    if (product.value) {
      acc[product.category] = (acc[product.category] || 0) + product.value;
    }
    return acc;
  }, {} as Record<string, number>);

  const valueChartData = Object.entries(valueByCategory).map(([category, value]) => ({
    name: category,
    value: value,
  }));

  // Data summary
  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const uniqueLocations = Array.from(new Set(products.map(p => p.location).filter(Boolean)));
  const missingFields = products.filter(p => !p.status || !p.category || !p.location);

  // Quick Insights calculations
  const statusCounts = products.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostCommonStatus = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0];

  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

  const locationCounts = products.reduce((acc, p) => {
    acc[p.location] = (acc[p.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topLocation = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0];

  const totalValue = products.reduce((sum, p) => sum + (p.value || 0), 0);

  const generateReport = () => {
    // Simulate report generation
    alert('Report generated! In a real app, this would download a PDF or Excel file.');
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Data Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Inventory Data Summary</h2>
              <div className="flex flex-wrap gap-4 text-sm">
                <span><b>Total Products:</b> {products.length}</span>
                <span><b>Categories:</b> {uniqueCategories.length}</span>
                <span><b>Locations:</b> {uniqueLocations.length}</span>
                {missingFields.length > 0 && (
                  <span className="text-red-600 font-semibold">{missingFields.length} product(s) with missing fields</span>
                )}
              </div>
            </div>
            <button
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
              onClick={() => setShowRaw(v => !v)}
            >
              {showRaw ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showRaw ? 'Hide Raw Data' : 'Show Raw Data'}
            </button>
          </div>
          {showRaw && (
            <div className="mt-4 max-h-64 overflow-auto bg-gray-50 dark:bg-gray-900 rounded p-2 text-xs">
              <pre>{JSON.stringify(products, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Comprehensive insights into your inventory performance
            </p>
          </div>
          <Button onClick={generateReport} className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="status">Status Analysis</SelectItem>
                    <SelectItem value="location">Location Analysis</SelectItem>
                    <SelectItem value="value">Value Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateRange">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Custom Range
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(products.reduce((sum, p) => sum + (p.value || 0), 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Locations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(locationData).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active storage locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(categoryData).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Product categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Common Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mostCommonStatus ? `${mostCommonStatus[0]} (${mostCommonStatus[1]})` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Most frequent product status
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {topCategory ? `${topCategory[0]} (${topCategory[1]})` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Category with most products
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {topLocation ? `${topLocation[0]} (${topLocation[1]})` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Location with most products
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Sum of all product values
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Inventory Report</CardTitle>
            <CardDescription>
              Complete list of all products with key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.slice(0, 10).map((product) => {
                  const statusInfo = statusConfig[product.status];
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Badge className={statusInfo.color}>
                          {statusInfo.icon} {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.location}</TableCell>
                      <TableCell>
                        {product.value ? formatCurrency(product.value) : '-'}
                      </TableCell>
                      <TableCell>{formatDate(product.updatedAt)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}