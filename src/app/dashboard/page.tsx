
"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PackagePlus, Search, ListOrdered, Receipt, ArrowRight, Activity, CheckCircle, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const quickAccessItems = [
  { title: 'Book a Shipment', href: '/dashboard/book-shipment', icon: PackagePlus, description: 'Create a new domestic or international shipment.' },
  { title: 'Track a Package', href: '/dashboard/track-shipment', icon: Search, description: 'Get real-time status updates on your package.' },
  { title: 'View All Shipments', href: '/dashboard/my-shipments', icon: ListOrdered, description: 'Browse your complete shipment history.' },
  { title: 'Manage Invoices', href: '/dashboard/my-invoices', icon: Receipt, description: 'Access and download all your invoices.' },
];

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
    <div className="bg-card/50 p-4 rounded-lg flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="animate-enter" style={{ animationDelay: '100ms' }}>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome back, {user.firstName || 'User'}!</h1>
        <p className="text-muted-foreground">Here's your dashboard at a glance. Ready to ship?</p>
      </div>
      
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-enter" 
        style={{ animationDelay: '200ms' }}
      >
        <StatCard title="In Transit" value="3" icon={Activity} />
        <StatCard title="Delivered" value="12" icon={CheckCircle} />
        <StatCard title="Pending" value="1" icon={Clock} />
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
                    <div className="flex items-center justify-between p-4">
                        <p className="text-sm">Shipment <span className="font-mono text-primary">RS123456</span> is out for delivery.</p>
                        <p className="text-xs text-muted-foreground">10 mins ago</p>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <p className="text-sm">Shipment <span className="font-mono text-primary">RS987654</span> was delivered.</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <p className="text-sm">New invoice created for shipment <span className="font-mono text-primary">RS555111</span>.</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                </div>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
