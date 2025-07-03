"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: number;
  shipment_id_str: string;
  amount: number;
  utr: string;
  status: 'Pending' | 'Verified' | 'Failed' | 'Approved' | 'Rejected';
  created_at: string;
}

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPayments() {
      if (!user?.email) return;

      try {
        setLoading(true);
        const response = await fetch(`https://www.server.shedloadoverseas.com/api/user/payments?email=${user.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch your payment history."
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [user, toast]);

  const getBadgeVariant = (status: Payment['status']) => {
    switch (status) {
        case 'Verified':
        case 'Approved':
            return 'default';
        case 'Pending':
            return 'outline';
        case 'Failed':
        case 'Rejected':
            return 'destructive';
        default:
            return 'secondary';
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>My Payments</CardTitle>
        <CardDescription>A record of all your transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UTR / Transaction ID</TableHead>
              <TableHead>Shipment ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : payments.length > 0 ? (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.utr}</TableCell>
                  <TableCell>{payment.shipment_id_str}</TableCell>
                  <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getBadgeVariant(payment.status)}>{payment.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        You have not made any payments yet.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
