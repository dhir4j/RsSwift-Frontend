
"use client";

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { ShipmentProvider } from '@/contexts/shipment-context';
import { AdminAuthProvider } from '@/contexts/admin-auth-context';
import { InvoiceProvider } from '@/contexts/invoice-context';
import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <AdminAuthProvider>
          <ShipmentProvider>
            <InvoiceProvider>
              {children}
            </InvoiceProvider>
          </ShipmentProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
