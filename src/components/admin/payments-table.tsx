"use client";

import { useEffect, useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2 } from "lucide-react";
import type { AdminPayment, PaymentStatus, UpdatePaymentStatusResponse } from '@/lib/types';
import apiClient from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

const statusColors: Record<PaymentStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Approved: "bg-green-100 text-green-700 border-green-300",
  Rejected: "bg-red-100 text-red-700 border-red-300",
};

export default function PaymentsTable() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const data: AdminPayment[] = await apiClient("/api/admin/payments");
      setPayments(data);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to fetch payments" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleUpdateStatus = async (paymentId: number, status: "Approved" | "Rejected") => {
    setUpdatingId(paymentId);
    try {
      const response = await apiClient<UpdatePaymentStatusResponse>(`/api/admin/payments/${paymentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      toast({ title: "Success", description: response.message });
      fetchPayments(); // Refresh the list
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to update status" });
    } finally {
      setUpdatingId(null);
    }
  };

  const getBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'outline';
      case 'Rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="rounded-md border">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Payment ID</TableHead>
            <TableHead>Shipment ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>UTR</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {loading ? (
            <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">Loading payments...</TableCell>
            </TableRow>
            ) : payments.length > 0 ? (
            payments.map((payment) => (
                <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell className="font-medium text-primary">{payment.order_id}</TableCell>
                <TableCell>{payment.first_name} {payment.last_name}</TableCell>
                <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                <TableCell>{payment.utr}</TableCell>
                <TableCell>{format(parseISO(payment.created_at), 'dd MMM yyyy')}</TableCell>
                <TableCell>
                    <Badge variant={getBadgeVariant(payment.status)} className={cn(statusColors[payment.status])}>{payment.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    {updatingId === payment.id ? (
                    <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                    ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={payment.status !== 'Pending'}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => handleUpdateStatus(payment.id, "Approved")}
                            disabled={payment.status !== 'Pending'}
                        >
                            Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleUpdateStatus(payment.id, "Rejected")}
                            disabled={payment.status !== 'Pending'}
                            className="text-destructive"
                        >
                            Reject
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    )}
                </TableCell>
                </TableRow>
            ))
            ) : (
            <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">No payments found.</TableCell>
            </TableRow>
            )}
        </TableBody>
        </Table>
    </div>
  );
}
