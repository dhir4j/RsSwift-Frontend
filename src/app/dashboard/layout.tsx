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
  PanelLeft,
  Phone,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Logo from '@/components/logo';

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
  const { isLoggedIn, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    // Redirect to login if not logged in OR if an admin tries to access the user dashboard
    if (!isLoggedIn || isAdmin) {
      router.push('/login');
    }
  }, [isLoggedIn, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  const navLinks = (
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <NavLink href="/dashboard"><Home className="h-4 w-4" />Dashboard</NavLink>
          <NavLink href="/dashboard/book-shipment"><Book className="h-4 w-4" />Book Shipment</NavLink>
          <NavLink href="/dashboard/track-shipment"><Compass className="h-4 w-4" />Track Shipment</NavLink>
          <NavLink href="/dashboard/my-shipments"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package-2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>My Shipments</NavLink>
          <NavLink href="/dashboard/my-invoices"><FileText className="h-4 w-4" />My Invoices</NavLink>
          <NavLink href="/dashboard/my-payments"><Landmark className="h-4 w-4" />My Payments</NavLink>
          <NavLink href="/customer-care"><Phone className="h-4 w-4" />Contact</NavLink>
      </nav>
  );

  if (!isLoggedIn || isAdmin) {
    return <div className="flex min-h-screen w-full items-center justify-center">Loading...</div>;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo />
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
                    <Logo />
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
