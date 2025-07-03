"use client";

import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}
interface Shipment {
    id: number;
    shipment_id_str: string;
    status: string;
    total_with_tax_18_percent: number;
    booking_date: string;
}
interface Payment {
    id: number;
    shipment_id_str: string;
    amount: number;
    status: string;
    created_at: string;
}
interface UserDetails {
    user: UserProfile;
    shipments: Shipment[];
    payments: Payment[];
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
    const [details, setDetails] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDetails() {
            try {
                setLoading(true);
                const response = await fetch(`https://www.server.shedloadoverseas.com/api/admin/users/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }
                const data: UserDetails = await response.json();
                setDetails(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            fetchDetails();
        }
    }, [params.id]);

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
                                    <TableCell>{shipment.shipment_id_str}</TableCell>
                                    <TableCell>{new Date(shipment.booking_date).toLocaleDateString()}</TableCell>
                                    <TableCell><Badge>{shipment.status}</Badge></TableCell>
                                    <TableCell className="text-right">₹{shipment.total_with_tax_18_percent.toLocaleString()}</TableCell>
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
                                    <TableCell>{payment.shipment_id_str}</TableCell>
                                    <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell><Badge variant={payment.status === 'Approved' ? 'default' : payment.status === 'Rejected' ? 'destructive' : 'outline'}>{payment.status}</Badge></TableCell>
                                    <TableCell className="text-right">₹{payment.amount.toLocaleString()}</TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell colSpan={4} className="text-center">No payments found.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
