"use client";

import { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2, Search, Download, ListOrdered, Filter } from "lucide-react";

interface Shipment {
  id: number;
  shipment_id_str: string;
  receiver_name: string;
  service_type: string;
  package_weight_kg: number;
  receiver_address_city: string;
  final_total_price_with_tax: number;
  booking_date: string;
  status: string;
  net_price?: number;
  tax?: number;
  total?: number;
}

interface ApiResponse {
    shipments: Shipment[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
}

const STATUS_OPTIONS = ["Booked", "Pending Payment", "In Transit", "Out for Delivery", "Delivered", "Cancelled", "On Hold"];
const UPDATE_STATUS_OPTIONS = ["Booked", "In Transit", "Out for Delivery", "Delivered", "Cancelled", "On Hold"];

export default function OrdersTable() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({ q: "", status: "" });

  const fetchShipments = async (pageNum = 1, query = "", status = "") => {
    try {
      setLoading(true);
      const url = new URL("https://www.server.shedloadoverseas.com/api/admin/shipments");
      url.searchParams.append("page", pageNum.toString());
      url.searchParams.append("limit", "10");
      if (query) url.searchParams.append("q", query);
      if (status) url.searchParams.append("status", status);
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch shipments");
      const result: ApiResponse = await response.json();

      const shipmentsWithPriceParts = result.shipments.map(shipment => {
          const total = shipment.final_total_price_with_tax;
          const net = total / 1.18;
          const tax = total - net;
          return { ...shipment, net_price: net, tax: tax, total: total };
      });

      setData({ ...result, shipments: shipmentsWithPriceParts });

    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments(page, appliedFilters.q, appliedFilters.status);
  }, [page, appliedFilters]);

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters({ q: searchQuery, status: statusFilter });
  };
  
  const handleUpdateStatus = async (shipmentIdStr: string, status: string, currentStatus: string) => {
    if (status === currentStatus) return;
    const shipment = data?.shipments.find(s => s.shipment_id_str === shipmentIdStr);
    if (!shipment) return;

    setUpdatingStatusId(shipment.id);
    try {
      const response = await fetch(`https://www.server.shedloadoverseas.com/api/admin/shipments/${shipmentIdStr}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, location: "Admin Panel", activity: `Status updated to ${status} by admin.` }),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || "Failed to update status");
      
      toast({ title: "Success", description: `Shipment status updated to ${status}` });
      fetchShipments(page, appliedFilters.q, appliedFilters.status);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const exportToCsv = async () => {
    toast({ title: "Exporting...", description: "Fetching all orders to generate CSV." });
    try {
        const url = new URL("https://www.server.shedloadoverseas.com/api/admin/shipments");
        url.searchParams.append("limit", (data?.totalCount || 1000).toString());
        if (appliedFilters.q) url.searchParams.append("q", appliedFilters.q);
        if (appliedFilters.status) url.searchParams.append("status", appliedFilters.status);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch data for export");
        const allData: ApiResponse = await response.json();
        
        const shipmentsWithPriceParts = allData.shipments.map(shipment => {
          const total = shipment.final_total_price_with_tax;
          const net = total / 1.18;
          const tax = total - net;
          return { ...shipment, net_price: net, tax: tax, total: total };
        });

        const headers = ["Order #", "Customer", "Description", "Price (Net)", "Tax (18%)", "Total", "Current Status", "Booking Date"];
        const rows = shipmentsWithPriceParts.map(s => [
            s.shipment_id_str,
            `"${s.receiver_name.replace(/"/g, '""')}"`,
            `"${s.service_type} (${s.package_weight_kg}kg) to ${s.receiver_address_city}"`,
            s.net_price?.toFixed(2),
            s.tax?.toFixed(2),
            s.total?.toFixed(2),
            s.status,
            `"${new Date(s.booking_date).toLocaleString()}"`
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Success", description: "CSV file downloaded." });
    } catch (error) {
        toast({ variant: "destructive", title: "Export Failed", description: (error as Error).message });
    }
  };

  const getBadgeVariant = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('delivered')) return 'default';
    if (lowerStatus.includes('pending')) return 'destructive';
    if (lowerStatus.includes('transit') || lowerStatus.includes('out for delivery')) return 'secondary';
    return 'outline';
  };

  const paginationControls = useMemo(() => {
    if (!data || data.totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
            Page {data.currentPage} of {data.totalPages}
        </span>
        <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages || loading}
        >
          Next
        </Button>
      </div>
    );
  }, [data, page, loading]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
                <ListOrdered className="h-6 w-6 text-muted-foreground" />
                <div>
                    <CardTitle>All Orders ({data?.totalCount ?? 0})</CardTitle>
                    <CardDescription>View, manage, and export all customer orders.</CardDescription>
                </div>
            </div>
            <Button variant="outline" onClick={exportToCsv} disabled={loading || !data || data.totalCount === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
            </Button>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search Order No, Sender, Receiver..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>
            <div className="flex w-full sm:w-auto gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Statuses</SelectItem>
                        {STATUS_OPTIONS.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleApplyFilters} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                    {loading && (appliedFilters.q !== "" || appliedFilters.status !== "") ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Filter className="mr-2 h-4 w-4" />}
                    Apply Filters
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Price (Net)</TableHead>
                    <TableHead className="text-right">Tax (18%)</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead className="text-center">Update Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center">Loading orders...</TableCell>
                        </TableRow>
                    ) : data?.shipments?.length ? (
                        data.shipments.map((shipment) => (
                            <TableRow key={shipment.id}>
                                <TableCell className="font-medium text-red-600">{shipment.shipment_id_str}</TableCell>
                                <TableCell>{shipment.receiver_name}</TableCell>
                                <TableCell className="text-muted-foreground text-xs">{`${shipment.service_type} (${shipment.package_weight_kg}kg) to ${shipment.receiver_address_city}`}</TableCell>
                                <TableCell className="text-right">₹{shipment.net_price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell className="text-right">₹{shipment.tax?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell className="text-right font-semibold">₹{shipment.total?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell>
                                    <Badge variant={getBadgeVariant(shipment.status)}>{shipment.status}</Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{new Date(shipment.booking_date).toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    {updatingStatusId === shipment.id ? (
                                        <div className="flex justify-center"><Loader2 className="h-4 w-4 animate-spin" /></div>
                                    ) : (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="w-[150px] justify-between">
                                                    {shipment.status}
                                                    <MoreHorizontal className="h-4 w-4 ml-2" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                {UPDATE_STATUS_OPTIONS.map(statusOption => (
                                                    <DropdownMenuItem
                                                        key={statusOption}
                                                        onClick={() => handleUpdateStatus(shipment.shipment_id_str, statusOption, shipment.status)}
                                                        disabled={statusOption === shipment.status}
                                                    >
                                                        {statusOption}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center">No orders found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
        {paginationControls}
      </CardContent>
    </Card>
  );
}
