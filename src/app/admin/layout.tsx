"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Home,
  LogOut,
  PanelLeft,
  Users,
  CreditCard,
  Loader2,
  UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import Logo from '@/components/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAdminAuth } from '@/hooks/use-admin-auth';

const NavLink = ({ href, children, closeSheet }: { href: string; children: React.ReactNode, closeSheet?: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link 
            href={href} 
            onClick={closeSheet}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", 
                isActive && "text-primary bg-muted"
            )}
        >
            {children}
        </Link>
    );
}

function AdminUserNav() {
  const { user } = useAuth(); 
  const { adminLogout } = useAdminAuth();
  const router = useRouter();

  const handleLogout = () => {
    adminLogout(); 
    router.replace('/admin/login');
  };

  if (!user || !user.isAdmin) return null; 

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
            <UserCircle className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logoutUser, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const isAdmin = user?.isAdmin;

  React.useEffect(() => {
    if (!isLoading && !isAdmin && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAdmin, isLoading, router, pathname]);

  const handleLogout = () => {
    logoutUser();
    router.push('/admin/login');
  };

  const closeSheet = () => setIsSheetOpen(false);
  
  const navLinks = (
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <NavLink href="/admin/dashboard" closeSheet={closeSheet}><Home className="h-4 w-4" />Dashboard</NavLink>
          <NavLink href="/admin/dashboard/payments" closeSheet={closeSheet}><CreditCard className="h-4 w-4" />Payments</NavLink>
          <NavLink href="/admin/dashboard/users" closeSheet={closeSheet}><Users className="h-4 w-4" />Users</NavLink>
      </nav>
  );

  if (pathname === '/admin/login') {
    return <main>{children}</main>;
  }

  if (isLoading || !isAdmin) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg text-muted-foreground">Loading Admin Panel...</span>
        </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-20 items-center border-b px-4 lg:h-20 lg:px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <Logo />
              <span className="border-l-2 border-border pl-2 ml-2">Admin Panel</span>
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
        <header className="flex h-20 items-center gap-4 border-b bg-muted/40 px-4 lg:h-20 lg:px-6">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <div className="flex h-20 items-center border-b px-4">
                 <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                    <Logo />
                    <span className="ml-2 font-semibold">Admin Panel</span>
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
             <h1 className="font-semibold text-lg">Welcome, {user?.firstName}!</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AdminUserNav />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
        </main>
      </div>
    </div>
  );
}