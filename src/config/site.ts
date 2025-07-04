
import { Home, PackagePlus, Search, ListOrdered, MessageSquare, Receipt, Wallet, LayoutDashboard, Users } from 'lucide-react'; 
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
}

export const dashboardNavItems: NavItem[] = [
  {
    title: 'Home',
    href: '/dashboard',
    icon: Home,
    description: 'Overview of your activities.',
  },
  {
    title: 'Book Shipment',
    href: '/dashboard/book-shipment',
    icon: PackagePlus,
    description: 'Create a new shipment.',
  },
  {
    title: 'Track Shipment',
    href: '/dashboard/track-shipment',
    icon: Search,
    description: 'Track an existing shipment.',
  },
  {
    title: 'My Shipments',
    href: '/dashboard/my-shipments',
    icon: ListOrdered,
    description: 'View your shipment history.',
  },
  {
    title: 'My Invoices',
    href: '/dashboard/my-invoices',
    icon: Receipt,
    description: 'View your invoices.',
  },
  {
    title: 'My Payments',
    href: '/dashboard/my-payments',
    icon: Wallet,
    description: 'Track your payment statuses.',
  },
];

export const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Payments',
        href: '/admin/payments',
        icon: Wallet,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
    }
];

export const siteConfig = {
  name: "SwiftShip",
  description: "Courier and shipment management solutions by RS SWIFT COURIERS LLP.",
  url: "https://swiftship.example.com", 
  ogImage: "https://swiftship.example.com/og.jpg", 
  mainNav: dashboardNavItems,
  company: {
    legalName: "RS SWIFT COURIERS LLP",
    address: "Your Company Address, City, State, Pincode",
    email: "support@swiftship.example.com",
    phone: "+91 12345 67890",
    gstin: "YOUR_GSTIN_HERE",
    pan: "YOUR_PAN_HERE"
  },
  links: {
  },
};
