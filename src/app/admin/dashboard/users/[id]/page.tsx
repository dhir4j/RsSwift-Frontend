"use client";

import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from '@/components/ui/skeleton';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import type { AdminUserDetailsResponse, UserShipmentSummary, UserPayment, TrackingStage } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { IndianRupee } from 'lucide-react';

const statusColors: Record<string, string> = {
  "Pending Payment": "bg-gray-100 text-gray-700 border-gray-300",
  Booked: "bg-blue-100 text-blue-700 border-blue-300",
  "In Transit": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Out for Delivery": "bg-orange-100 text-orange-700 border-orange-300",
  Delivered: "bg-green-100 text-green-700 border-green-300",
  Cancelled: "bg-red-100 text-red-700 border-red-300",
};

export default function UserDetailPage({ params }: { params: { id: string } }) {
    const [details, setDetails] = useState<AdminUserDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchDetails() {
            if (!params.id) return;
            try {
                setLoading(true);
                const data: AdminUserDetailsResponse = await apiClient(`/api/admin/users/${params.id}`);
                setDetails(data);
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Failed to fetch user details",
                    description: error.message || "An unknown error occurred",
                });
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [params.id, toast]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
            </div>
        )
    }

    if (!details) {
        return <p>User not found.</p>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{details.user.first_name} {details.user.last_name}</CardTitle>
                    <CardDescription>{details.user.email} - Member since {new Date(details.user.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Shipment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Shipment ID</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {details.shipments.length > 0 ? details.shipments.map(shipment => (
                                <TableRow key={shipment.id}>
                                    <TableCell className="font-medium text-primary">{shipment.shipment_id_str}</TableCell>
                                    <TableCell>{new Date(shipment.booking_date).toLocaleDateString()}</TableCell>
                                    <TableCell><Badge variant="outline" className={cn(statusColors[shipment.status])}>{shipment.status}</Badge></TableCell>
                                    <TableCell className="text-right flex items-center justify-end">
                                      <IndianRupee className="h-4 w-4 mr-1 text-muted-foreground" />
                                      {shipment.total_with_tax_18_percent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell colSpan={4} className="text-center">No shipments found.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead>Shipment ID</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {details.payments.length > 0 ? details.payments.map(payment => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium text-primary">{payment.shipment_id_str}</TableCell>
                                    <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell><Badge variant={payment.status === 'Approved' ? 'default' : payment.status === 'Rejected' ? 'destructive' : 'outline'}>{payment.status}</Badge></TableCell>
                                    <TableCell className="text-right flex items-center justify-end">
                                      <IndianRupee className="h-4 w-4 mr-1 text-muted-foreground" />
                                      {payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell colSpan={4} className="text-center">No payments found.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
