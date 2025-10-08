
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import type { Shipment, TrackingStage, AdminShipmentsResponse, UpdateShipmentStatusResponse } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, PackageSearch, FileDown, Search, ListOrdered, Filter, Loader2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO, isValid } from 'date-fns';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { mapApiShipmentToFrontend } from '@/contexts/shipment-context';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  "Pending Payment": "bg-gray-100 text-gray-700 border-gray-300",
  Booked: "bg-blue-100 text-blue-700 border-blue-300",
  "In Transit": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Out for Delivery": "bg-orange-100 text-orange-700 border-orange-300",
  Delivered: "bg-green-100 text-green-700 border-green-300",
  Cancelled: "bg-red-100 text-red-700 border-red-300",
};

export function AdminOrdersTable() {
  const [allShipments, setAllShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const { toast } = useToast();
  const { user, isAuthenticated, logoutUser } = useAuth();
  const router = useRouter();

  const handleApiError = useCallback((error: any, operation: string) => {
    console.error(`API error during ${operation}:`, error);
    const errorMessage = error?.data?.error || error.message || "An unexpected error occurred.";
    toast({
      title: `Error ${operation}`,
      description: errorMessage,
      variant: "destructive",
    });
  }, [toast]);

  const fetchAdminShipments = useCallback(async (page = 1, search = searchTerm, status = statusFilter) => {
    if (!isAuthenticated || !user?.isAdmin) return;
    setIsLoading(true);
    try {
      let queryParams = `?page=${page}&limit=${itemsPerPage}`;
      if (search) queryParams += `&q=${encodeURIComponent(search)}`;
      if (status !== 'all') queryParams += `&status=${encodeURIComponent(status)}`;

      const response = await apiClient<AdminShipmentsResponse>(`/api/admin/shipments${queryParams}`);
      setAllShipments(response.shipments.map(mapApiShipmentToFrontend));
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setTotalCount(response.totalCount);
    } catch (error: any) {
      handleApiError(error, 'fetching admin shipments');
      setAllShipments([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [user?.isAdmin, isAuthenticated, searchTerm, statusFilter, handleApiError]);

  useEffect(() => {
    fetchAdminShipments(1, searchTerm, statusFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchAdminShipments(newPage, searchTerm, statusFilter);
    }
  };

  const handleStatusUpdate = async (shipmentId: string, newStatus: TrackingStage, currentShipment: Shipment) => {
    try {
      const response = await apiClient<UpdateShipmentStatusResponse>(`/api/admin/shipments/${shipmentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, location: currentShipment.receiver_address_city, activity: `Status updated to ${newStatus}` }),
      });
      toast({ title: "Success", description: `Shipment ${shipmentId} status updated to ${newStatus}.` });
      setAllShipments(prev =>
        prev.map(s => s.shipment_id_str === shipmentId ? { ...s, status: newStatus, tracking_history: response.updatedShipment.tracking_history || s.tracking_history } : s)
      );
    } catch (error: any) {
      handleApiError(error, `updating status for ${shipmentId}`);
    }
  };

  const exportToCSV = useCallback(() => {
    if (allShipments.length === 0) {
        toast({ title: "No Data", description: "Nothing to export.", variant: "default"});
        return;
    }
    const headers = [
      "Order Number (shipment_id_str)", "Sender Name", "Receiver Name", "Destination", "Weight (kg)", "Total Price", "Status", "Booking Date"
    ];

    const rows = allShipments.map(order => {
        const bookingDate = order.booking_date && isValid(parseISO(order.booking_date)) ? format(parseISO(order.booking_date), 'yyyy-MM-dd HH:mm') : 'N/A';
        return [
            `"${order.shipment_id_str || 'Unknown ID'}"`,
            `"${order.sender_name || 'N/A'}"`,
            `"${order.receiver_name || 'N/A'}"`,
            `"${order.receiver_address_city || 'N/A'}"`,
            order.package_weight_kg || 'N/A',
            typeof order.total_with_tax_18_percent === 'number' ? order.total_with_tax_18_percent.toFixed(2) : 'N/A',
            `"${order.status || 'N/A'}"`,
            `"${bookingDate}"`
        ];
    });

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `swiftship_all_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [allShipments, toast]);


  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <CardTitle className="font-headline text-xl sm:text-2xl flex items-center gap-2">
            <ListOrdered className="h-7 w-7 text-primary" /> All Orders ({totalCount})
          </CardTitle>
          <CardDescription>View, manage, and export all customer orders.</CardDescription>
        </div>
         <Button onClick={exportToCSV} variant="outline" size="sm" className="mt-4 md:mt-0" disabled={allShipments.length === 0}>
          <FileDown className="mr-2 h-4 w-4" /> Export to CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 border rounded-lg bg-muted/50 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search Order No, Sender, Receiver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <div className="flex-grow md:flex-grow-0">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TrackingStage | 'all')}>
                    <SelectTrigger className="w-full md:w-[180px]">
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
            </div>
             <Button onClick={() => fetchAdminShipments(1, searchTerm, statusFilter)} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                Apply Filters
            </Button>
        </div>

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
                    <TableHead>Order #</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead className="text-center">Weight</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allShipments.map((order) => {
                        return (
                            <TableRow key={order.shipment_id_str}>
                                <TableCell className="font-medium text-primary">{order.shipment_id_str}</TableCell>
                                <TableCell>{order.sender_name}</TableCell>
                                <TableCell>{order.receiver_name}</TableCell>
                                <TableCell>{order.receiver_address_city}</TableCell>
                                <TableCell className="text-center">{order.package_weight_kg} kg</TableCell>
                                <TableCell className="text-right font-semibold">
                                    <span className="inline-flex items-center justify-end">
                                        <IndianRupee className="h-4 w-4 mr-0.5" />
                                        {order.total_with_tax_18_percent.toFixed(2)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                <Badge variant="outline" className={cn("text-xs", statusColors[order.status] || "bg-gray-100 text-gray-700 border-gray-300")}>
                                    {order.status}
                                </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Select
                                      value={order.status}
                                      onValueChange={(newStatus) => handleStatusUpdate(order.shipment_id_str, newStatus as TrackingStage, order)}
                                      disabled={order.status === 'Pending Payment'}
                                  >
                                      <SelectTrigger className="h-9 text-xs inline-flex w-auto min-w-[150px]">
                                        <SelectValue placeholder="Update Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                      {Object.keys(statusColors).filter(s => s !== "Pending Payment").map(statusVal => (
                                          <SelectItem key={statusVal} value={statusVal} className="text-xs">{statusVal}</SelectItem>
                                      ))}
                                      </SelectContent>
                                  </Select>
                                  <Button asChild variant="outline" size="sm">
                                      <Link href={`/admin/invoice/${order.shipment_id_str}`}>
                                          <Eye className="mr-1 h-4 w-4" /> Invoice
                                      </Link>
                                  </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
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
    </Card>
  );
}

    