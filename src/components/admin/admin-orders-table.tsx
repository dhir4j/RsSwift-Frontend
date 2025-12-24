"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { Shipment, TrackingStage, AdminShipmentsResponse, UpdateShipmentStatusResponse } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, PackageSearch, FileDown, Search, ListOrdered, Filter, Loader2, Eye, MoreHorizontal, AlertCircle, X, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO, isValid } from 'date-fns';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { mapApiShipmentToFrontend } from '@/contexts/shipment-context';
import Link from 'next/link';
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const statusColors: Record<string, string> = {
  "Pending Payment": "bg-gray-100 text-gray-700 border-gray-300",
  Booked: "bg-blue-100 text-blue-700 border-blue-300",
  "In Transit": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Out for Delivery": "bg-orange-100 text-orange-700 border-orange-300",
  Delivered: "bg-green-100 text-green-700 border-green-300",
  Cancelled: "bg-red-100 text-red-700 border-red-300",
};

const BULK_STATUS_OPTIONS: TrackingStage[] = ["Booked", "In Transit", "Out for Delivery", "Delivered", "Cancelled"];

export function AdminOrdersTable() {
  const [allShipments, setAllShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [bulkStatus, setBulkStatus] = useState<TrackingStage | ''>('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const itemsPerPage = 500;

  const { toast } = useToast();
  const { user, isAuthenticated, logoutUser } = useAuth();
  const router = useRouter();

  const numSelected = useMemo(() => Object.values(selectedRows).filter(Boolean).length, [selectedRows]);

  const handleApiError = useCallback((error: any, operation: string) => {
    console.error(`API error during ${operation}:`, error);
    const errorMessage = error?.data?.error || error.message || "An unexpected error occurred.";
    toast({
      title: `Error ${operation}`,
      description: errorMessage,
      variant: "destructive",
    });
  }, [toast]);

  const fetchAdminShipments = useCallback(async (page = 1, search = searchTerm, status = statusFilter, fromDate = startDate, toDate = endDate) => {
    if (!isAuthenticated || !user?.isAdmin) return;
    setIsLoading(true);
    try {
      let queryParams = `?page=${page}&limit=${itemsPerPage}`;
      if (search) queryParams += `&q=${encodeURIComponent(search)}`;
      if (status !== 'all') queryParams += `&status=${encodeURIComponent(status)}`;
      if (fromDate) queryParams += `&start_date=${encodeURIComponent(fromDate)}`;
      if (toDate) queryParams += `&end_date=${encodeURIComponent(toDate)}`;

      const response = await apiClient<AdminShipmentsResponse>(`/api/admin/shipments${queryParams}`);
      setAllShipments(response.shipments.map(mapApiShipmentToFrontend));
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setTotalCount(response.totalCount);
    } catch (error: any) {
      handleApiError(error, 'fetching admin shipments');
      setAllShipments([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.isAdmin, isAuthenticated, searchTerm, statusFilter, startDate, endDate, handleApiError]);

  useEffect(() => {
    fetchAdminShipments(1, searchTerm, statusFilter, startDate, endDate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchAdminShipments(newPage, searchTerm, statusFilter, startDate, endDate);
    }
  };

  const handleToggleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      const newSelectedRows: Record<string, boolean> = {};
      allShipments.forEach(shipment => {
        newSelectedRows[shipment.shipment_id_str] = true;
      });
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows({});
    }
  };

  const handleRowCheckboxChange = (shipmentId: string, checked: boolean) => {
    setSelectedRows(prev => ({
      ...prev,
      [shipmentId]: checked
    }));
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || numSelected === 0) {
      toast({ title: 'Invalid Action', description: 'Please select a status and at least one order.', variant: 'destructive' });
      return;
    }
    
    setIsBulkUpdating(true);
    const selectedIds = Object.keys(selectedRows).filter(id => selectedRows[id]);
    
    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedIds) {
      try {
        await apiClient<UpdateShipmentStatusResponse>(`/api/admin/shipments/${id}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status: bulkStatus }),
        });
        successCount++;
      } catch (error) {
        console.error(`Failed to update shipment ${id}:`, error);
        errorCount++;
      }
    }

    setIsBulkUpdating(false);

    if (successCount > 0) {
      toast({ title: 'Bulk Update Successful', description: `${successCount} order(s) updated to "${bulkStatus}".` });
      fetchAdminShipments(currentPage, searchTerm, statusFilter, startDate, endDate); // Refresh data
    }

    if (errorCount > 0) {
      toast({ title: 'Bulk Update Failed', description: `${errorCount} order(s) could not be updated.`, variant: 'destructive' });
    }
    
    setSelectedRows({});
    setBulkStatus('');
  };

  const exportToCSV = useCallback(() => {
    if (allShipments.length === 0) {
      toast({ title: "No Data", description: "No orders to export.", variant: "destructive" });
      return;
    }

    setIsExporting(true);
    try {
      const headers = ["Order #", "Type", "Sender", "Sender City", "Receiver", "Receiver City", "Weight (kg)", "Date", "Price (excl. tax)", "Tax (18%)", "Total Amount", "Status"];

      const rows = allShipments.map(order => [
        `"${order.shipment_id_str}"`,
        `"${order.service_type}"`,
        `"${order.sender_name}"`,
        `"${order.sender_address_city}"`,
        `"${order.receiver_name}"`,
        `"${order.receiver_address_city}"`,
        order.package_weight_kg,
        `"${format(parseISO(order.booking_date), 'yyyy-MM-dd HH:mm')}"`,
        order.price_without_tax.toFixed(2),
        order.tax_amount_18_percent.toFixed(2),
        order.total_with_tax_18_percent.toFixed(2),
        `"${order.status}"`
      ].join(','));

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: "Export Successful", description: `${allShipments.length} orders exported successfully.` });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({ title: "Export Failed", description: "Failed to export CSV file.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  }, [allShipments, toast]);

  return (
    <Card className="shadow-xl mt-8">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <CardTitle className="font-headline text-xl sm:text-2xl flex items-center gap-2">
              <ListOrdered className="h-7 w-7 text-primary" /> All Orders ({totalCount})
            </CardTitle>
            <CardDescription>View, manage, and export all customer orders.</CardDescription>
          </div>
          <Button onClick={exportToCSV} variant="outline" size="sm" className="mt-4 md:mt-0" disabled={isExporting}>
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
        <div className="mt-6 p-4 border rounded-lg bg-muted/50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search Order No, Sender, Receiver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                  <SelectTrigger className="w-full">
                      <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {Object.keys(statusColors).map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              <Input
                type="date"
                placeholder="From Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
              <Input
                type="date"
                placeholder="To Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => fetchAdminShipments(1, searchTerm, statusFilter, startDate, endDate)} disabled={isLoading} className="flex-1 md:flex-none">
                {isLoading && !allShipments.length ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                Apply Filters
              </Button>
              {(searchTerm || statusFilter !== 'all' || startDate || endDate) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setStartDate('');
                    setEndDate('');
                    fetchAdminShipments(1, '', 'all', '', '');
                  }}
                >
                  <X className="mr-2 h-4 w-4"/>
                  Clear Filters
                </Button>
              )}
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && allShipments.length === 0 ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <p className="ml-2">Loading orders...</p></div>
        ) : !isLoading && allShipments.length === 0 ? (
          <div className="text-center py-12">
            <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">No Orders Found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead padding="checkbox" className="w-[50px]">
                        <Checkbox
                          checked={numSelected > 0 && numSelected === allShipments.length ? true : numSelected > 0 ? "indeterminate" : false}
                          onCheckedChange={handleToggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>Order #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Sender</TableHead>
                      <TableHead>Receiver</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allShipments.map((order) => (
                        <TableRow key={order.shipment_id_str} data-state={selectedRows[order.shipment_id_str] ? 'selected' : ''}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedRows[order.shipment_id_str] || false}
                                onCheckedChange={(checked) => handleRowCheckboxChange(order.shipment_id_str, !!checked)}
                                aria-label="Select row"
                              />
                            </TableCell>
                            <TableCell className="font-medium text-primary">{order.shipment_id_str}</TableCell>
                            <TableCell className="text-xs">{order.service_type}</TableCell>
                            <TableCell>{order.sender_name}</TableCell>
                            <TableCell>{order.receiver_name}</TableCell>
                            <TableCell>{order.receiver_address_city}</TableCell>
                            <TableCell className="text-xs">{format(parseISO(order.booking_date), 'dd MMM yyyy')}</TableCell>
                            <TableCell className="text-right">
                                <span className="inline-flex items-center justify-end">
                                    <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                                    {order.total_with_tax_18_percent.toFixed(2)}
                                </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("text-xs", statusColors[order.status])}>{order.status}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/admin/invoice/${order.shipment_id_str}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading}>Next</Button>
              </div>
            )}
          </>
        )}
      </CardContent>

      {numSelected > 0 && (
          <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur-sm p-3 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
              <span className="text-sm font-semibold">{numSelected} order(s) selected</span>
              <div className="flex items-center gap-2">
                  <Select value={bulkStatus} onValueChange={(value) => setBulkStatus(value as TrackingStage)}>
                      <SelectTrigger className="w-[180px] h-9">
                          <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                          {BULK_STATUS_OPTIONS.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  <Button size="sm" onClick={() => setIsConfirmDialogOpen(true)} disabled={!bulkStatus || isBulkUpdating}>
                      {isBulkUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                      Update Status
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedRows({})}>
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
              </div>
          </div>
      )}

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will update the status of <strong>{numSelected}</strong> selected order(s) to <strong>{bulkStatus}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setIsConfirmDialogOpen(false); handleBulkUpdate(); }}>Confirm Update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
