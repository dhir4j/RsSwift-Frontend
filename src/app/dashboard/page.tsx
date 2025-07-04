
"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PackagePlus, Search, ListOrdered, Receipt, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useShipments } from '@/hooks/use-shipments';
import { useEffect, useMemo } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const quickAccessItems = [
  { title: 'Book a Shipment', href: '/dashboard/book-shipment', icon: PackagePlus, description: 'Create a new domestic or international shipment.' },
  { title: 'Track a Package', href: '/dashboard/track-shipment', icon: Search, description: 'Get real-time status updates on your package.' },
  { title: 'View All Shipments', href: '/dashboard/my-shipments', icon: ListOrdered, description: 'Browse your complete shipment history.' },
  { title: 'Manage Invoices', href: '/dashboard/my-invoices', icon: Receipt, description: 'Access and download all your invoices.' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { shipments, isLoading, fetchUserShipments } = useShipments();
  
  useEffect(() => {
    fetchUserShipments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recentShipments = useMemo(() => {
      if (!shipments) return [];
      return shipments
          .sort((a, b) => {
            try {
              return parseISO(b.booking_date).getTime() - parseISO(a.booking_date).getTime()
            } catch (e) {
              return 0;
            }
          })
          .slice(0, 3);
  }, [shipments]);


  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="animate-enter" style={{ animationDelay: '100ms' }}>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome back, {user.firstName || 'User'}!</h1>
        <p className="text-muted-foreground">Here's your dashboard at a glance. Ready to ship?</p>
      </div>
      
      <Separator />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline animate-enter" style={{ animationDelay: '300ms' }}>Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {quickAccessItems.map((item, index) => (
            <Link href={item.href} key={item.href} className="group">
                <Card 
                  className="bg-card/70 hover:bg-card border-border/50 hover:border-primary/50 transition-all duration-300 futuristic-grid-glow animate-enter"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                        <item.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center text-primary font-medium text-sm mt-4">
                            <span>Go to {item.title.split(' ')[0]}</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </div>

       <div className="animate-enter" style={{ animationDelay: '800ms' }}>
        <h2 className="text-2xl font-bold font-headline">Recent Activity</h2>
        <Card className="mt-4">
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                   {isLoading && recentShipments.length === 0 ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))
                    ) : recentShipments.length > 0 ? (
                        recentShipments.map(shipment => (
                             <div key={shipment.shipment_id_str} className="flex items-center justify-between p-4 gap-4">
                                <p className="text-sm flex-grow">
                                    Shipment <Link href={`/dashboard/track-shipment?id=${shipment.shipment_id_str}`} className="font-mono text-primary hover:underline">{shipment.shipment_id_str}</Link> has been updated to: <span className="font-semibold">{shipment.status}</span>.
                                </p>
                                <p className="text-xs text-muted-foreground flex-shrink-0">{formatDistanceToNow(parseISO(shipment.booking_date), { addSuffix: true })}</p>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-muted-foreground">
                            No recent activity. Book a shipment to get started!
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
