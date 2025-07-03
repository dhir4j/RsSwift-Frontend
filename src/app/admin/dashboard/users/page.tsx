import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "@/components/admin/users-table";

export default function AdminUsersPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>View, search, and manage user accounts.</CardDescription>
            </CardHeader>
            <CardContent>
                <UsersTable />
            </CardContent>
        </Card>
    );
}
