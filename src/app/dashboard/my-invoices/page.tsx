"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";

interface Shipment {
  id: number;
  shipment_id_str: string;
  booking_date: string;
  status: string;
  total_with_tax_18_percent: number;
}

interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'Paid' | 'Pending';
}

export default function MyInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInvoices() {
      if (!user?.email) return;

      try {
        setLoading(true);
        const response = await fetch(`https://www.server.shedloadoverseas.com/api/shipments?email=${user.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shipments for invoices');
        }
        const data: Shipment[] = await response.json();
        
        const formattedInvoices: Invoice[] = data.map(shipment => ({
            id: shipment.shipment_id_str,
            date: new Date(shipment.booking_date).toLocaleDateString(),
            amount: `₹${shipment.total_with_tax_18_percent.toLocaleString()}`,
            status: shipment.status === 'Pending Payment' ? 'Pending' : 'Paid',
        }));

        setInvoices(formattedInvoices);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch your invoices."
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if(user) {
        fetchInvoices();
    }
  }, [user, toast]);

  const handleDownload = () => {
      // In a real app, this would trigger a PDF download.
      toast({
          title: "Coming Soon!",
          description: "PDF invoice downloads are not yet implemented."
      });
  }

  const getBadgeVariant = (status: Invoice['status']) => {
    switch (status) {
        case 'Paid':
            return 'default';
        case 'Pending':
            return 'destructive';
        default:
            return 'outline';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Invoices</CardTitle>
        <CardDescription>View and download your shipment invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                 [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : invoices.length > 0 ? (
                invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                            <Badge variant={getBadgeVariant(invoice.status)}>
                                {invoice.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={handleDownload}>
                                <Download className="h-4 w-4"/>
                                <span className="sr-only">Download</span>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        You have no invoices yet.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
