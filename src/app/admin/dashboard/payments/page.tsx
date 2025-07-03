import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentsTable from "@/components/admin/payments-table";

export default function AdminPaymentsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Payments</CardTitle>
                <CardDescription>Review and update the status of user payment submissions.</CardDescription>
            </CardHeader>
            <CardContent>
                <PaymentsTable />
            </CardContent>
        </Card>
    );
}
