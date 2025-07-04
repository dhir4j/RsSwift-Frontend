
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPaymentsTable } from '@/components/admin/admin-payments-table';
import { Wallet } from 'lucide-react';

export default function AdminPaymentsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center gap-2">
                    <Wallet className="h-8 w-8 text-primary" /> Payment Submissions
                </CardTitle>
                <CardDescription>Review and process pending payment submissions.</CardDescription>
            </CardHeader>
            <CardContent>
                <AdminPaymentsTable />
            </CardContent>
        </Card>
    );
}
