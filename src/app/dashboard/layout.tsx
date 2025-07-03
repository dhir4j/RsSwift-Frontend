"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Book,
  Compass,
  FileText,
  Home,
  Landmark,
  LogOut,
  Package2,
  PanelLeft,
  Phone,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link href={href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", isActive && "text-primary bg-muted")}>
            {children}
        </Link>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  const navLinks = (
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <NavLink href="/dashboard"><Home className="h-4 w-4" />Dashboard</NavLink>
          <NavLink href="/dashboard/book-shipment"><Book className="h-4 w-4" />Book Shipment</NavLink>
          <NavLink href="/dashboard/track-shipment"><Compass className="h-4 w-4" />Track Shipment</NavLink>
          <NavLink href="/dashboard/my-shipments"><Package2 className="h-4 w-4" />My Shipments</NavLink>
          <NavLink href="/dashboard/my-invoices"><FileText className="h-4 w-4" />My Invoices</NavLink>
          <NavLink href="/dashboard/my-payments"><Landmark className="h-4 w-4" />My Payments</NavLink>
          <NavLink href="/customer-care"><Phone className="h-4 w-4" />Contact</NavLink>
      </nav>
  );

  if (!isLoggedIn) {
    return <div className="flex min-h-screen w-full items-center justify-center">Loading...</div>;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="">RS SWIFT COURIERS</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">{navLinks}</div>
          <div className="mt-auto p-4">
             <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-2">
               <LogOut className="h-4 w-4" />
               Logout
             </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <div className="flex h-14 items-center border-b px-4">
                 <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Package2 className="h-6 w-6 text-primary" />
                    <span className="">RS SWIFT COURIERS</span>
                </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">{navLinks}</div>
                <div className="mt-auto p-4 border-t">
                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                    </Button>
                </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
        </main>
      </div>
    </div>
  );
}
