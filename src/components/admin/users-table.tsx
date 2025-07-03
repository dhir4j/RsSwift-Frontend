"use client";

import { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Search } from "lucide-react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  shipment_count: number;
}

interface ApiResponse {
    users: User[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
}

export default function UsersTable() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const fetchUsers = async (pageNum = 1, searchQuery = "") => {
    try {
      setLoading(true);
      const url = new URL("https://www.server.shedloadoverseas.com/api/admin/users");
      url.searchParams.append("page", pageNum.toString());
      url.searchParams.append("limit", "10");
      if (searchQuery) {
        url.searchParams.append("q", searchQuery);
      }
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch users");
      const result: ApiResponse = await response.json();
      setData(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchUsers(page, query);
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [page, query]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPage(1); // Reset to first page on new search
      setQuery(e.target.value);
  }

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search by name or email..."
                value={query}
                onChange={handleSearchChange}
                className="max-w-sm"
            />
        </div>
        <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Shipments</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading users...</TableCell>
                </TableRow>
                ) : data?.users?.length ? (
                data.users.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{user.shipment_count}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" asChild>
                           <Link href={`/admin/dashboard/users/${user.id}`}>
                             <Eye className="h-4 w-4" />
                             <span className="sr-only">View User</span>
                           </Link>
                       </Button>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center">No users found.</TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
            >
            Previous
            </Button>
            <span className="text-sm">
                Page {data?.currentPage || 0} of {data?.totalPages || 0}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(data?.totalPages || 1, p + 1))}
                disabled={page === data?.totalPages || loading}
            >
            Next
            </Button>
      </div>
    </div>
  );
}
