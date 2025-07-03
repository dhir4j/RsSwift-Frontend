"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Book } from "lucide-react";

interface Shipment {
  id: number;
  shipment_id_str: string;
  receiver_name: string;
  booking_date: string;
  status: string;
  total_with_tax_18_percent: number;
}

export default function MyShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchShipments() {
      if (!user?.email) return;

      try {
        setLoading(true);
        const response = await fetch(`https://www.server.shedloadoverseas.com/api/shipments?email=${user.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shipments');
        }
        const data = await response.json();
        setShipments(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch your shipments."
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchShipments();
  }, [user, toast]);

  const getBadgeVariant = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('delivered')) return 'default';
    if (lowerStatus.includes('pending')) return 'destructive';
    return 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Shipments</CardTitle>
            <CardDescription>A list of all your past and current shipments.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/book-shipment"><Book className="mr-2 h-4 w-4" />Book New Shipment</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : shipments.length > 0 ? (
              shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.shipment_id_str}</TableCell>
                  <TableCell>{shipment.receiver_name}</TableCell>
                  <TableCell>{new Date(shipment.booking_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(shipment.status)}>{shipment.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">₹{shipment.total_with_tax_18_percent.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        You have not booked any shipments yet.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
