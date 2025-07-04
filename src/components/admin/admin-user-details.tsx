"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminUserDetails({ userId }: { userId: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Details for user ID: {userId}</p>
        <p>This is a placeholder component.</p>
      </CardContent>
    </Card>
  );
}
