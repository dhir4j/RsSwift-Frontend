"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2 } from "lucide-react";

interface Payment {
  id: number;
  order_id: string;
  first_name: string;
  last_name: string;
  amount: number;
  utr: string;
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
}

export default function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://www.server.shedloadoverseas.com/api/admin/payments");
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (paymentId: number, status: "Approved" | "Rejected") => {
    setUpdatingId(paymentId);
    try {
      const response = await fetch(`https://www.server.shedloadoverseas.com/api/admin/payments/${paymentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update status");
      
      toast({ title: "Success", description: `Payment status updated to ${status}` });
      fetchPayments(); // Refresh the list
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    } finally {
      setUpdatingId(null);
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'outline';
      case 'Rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
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
            <TableCell colSpan={8} className="text-center">Loading payments...</TableCell>
          </TableRow>
        ) : payments.length > 0 ? (
          payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.id}</TableCell>
              <TableCell className="font-medium">{payment.order_id}</TableCell>
              <TableCell>{payment.first_name} {payment.last_name}</TableCell>
              <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
              <TableCell>{payment.utr}</TableCell>
              <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(payment.status)}>{payment.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {updatingId === payment.id ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
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
            <TableCell colSpan={8} className="text-center">No payments found.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
