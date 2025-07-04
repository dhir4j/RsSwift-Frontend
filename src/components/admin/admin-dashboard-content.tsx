
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, DollarSign, Users, TrendingUp, Loader2 } from "lucide-react";
import { AdminOrdersTable } from './admin-orders-table';
import apiClient from '@/lib/api-client';
import type { WebAnalyticsResponse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

interface AdminAnalyticsData {
  total_orders: number | null;
  total_revenue: number | null;
  avg_revenue: number | null;
  total_users: number | null;
}

export function AdminDashboardContent() {
  const [analyticsData, setAnalyticsData] = useState<AdminAnalyticsData>({
    total_orders: null,
    total_revenue: null,
    avg_revenue: null,
    total_users: null,
  });
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const { toast } = useToast();
  const { user, isAuthenticated, logoutUser } = useAuth();
  const router = useRouter();
  
  const handleApiError = useCallback((error: any, operation: string) => {
    console.error(`API error during ${operation}:`, error);
    const errorMessage = error?.data?.error || error.message || "An unexpected error occurred.";
    toast({
      title: `Error ${operation}`,
      description: errorMessage,
      variant: "destructive",
    });
  }, [toast]);


  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!isAuthenticated || !user?.isAdmin) {
        setIsLoadingAnalytics(false);
        return;
      }
      setIsLoadingAnalytics(true);
      try {
        const data = await apiClient<WebAnalyticsResponse>('/api/admin/web_analytics');
        setAnalyticsData({
          total_orders: data.total_orders,
          total_revenue: data.total_revenue,
          avg_revenue: data.avg_revenue,
          total_users: data.total_users,
        });
      } catch (error: any) {
        handleApiError(error, 'fetching web analytics');
        setAnalyticsData({ total_orders: null, total_revenue: null, avg_revenue: null, total_users: null });
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [isAuthenticated, user?.isAdmin, handleApiError]);

  const formatCurrency = (amount: number | null) => {
    if (amount === null || isNaN(amount)) return 'N/A';
    const numberPart = amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `₹${numberPart}`;
  };
  
  const formatNumber = (num: number | null) => {
    if (num === null || isNaN(num)) return 'N/A';
    return num.toLocaleString('en-IN');
  }

  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Package className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    {isLoadingAnalytics ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                    <div className="text-2xl font-bold">{formatNumber(analyticsData.total_orders)}</div>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    {isLoadingAnalytics ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                    <div className="text-2xl font-bold">{formatCurrency(analyticsData.total_revenue)}</div>
                    )}
                </CardContent>
            </Card>
            <Link href="/admin/dashboard/users" className="group">
                <Card className="h-full transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/50 group-hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingAnalytics ? (
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (
                        <div className="text-2xl font-bold">{formatNumber(analyticsData.total_users)}</div>
                        )}
                    </CardContent>
                </Card>
            </Link>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Revenue/Order</CardTitle>
                    <TrendingUp className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    {isLoadingAnalytics ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                    <div className="text-2xl font-bold">{formatCurrency(analyticsData.avg_revenue)}</div>
                    )}
                </CardContent>
            </Card>
        </div>
        
        <AdminOrdersTable />
    </div>
  );
}
