"use client";
import React from 'react';

// This layout is now handled by the root admin layout at /src/app/admin/layout.tsx.
// This component just passes its children through to avoid nested layouts.
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
