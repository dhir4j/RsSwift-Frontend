import { Home, PackagePlus, Search, ListOrdered, Receipt, Wallet, LayoutDashboard, Users, MessageSquare } from 'lucide-react'; 
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
  isSeparator?: boolean;
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
  {
    title: 'Contact',
    href: '/dashboard/contact',
    icon: MessageSquare,
    description: 'Get support and contact information.',
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
  name: "RS SWIFT",
  description: "Courier and shipment management solutions by RS SWIFT COURIERS LLP.",
  url: "https://rsswift.example.com", 
  ogImage: "https://rsswift.example.com/og.jpg", 
  mainNav: dashboardNavItems,
  company: {
    legalName: "RS SWIFT COURIERS LLP",
    address: "18AX MODEL TOWN EXTENSION LUDHIANA NEAR PUNJAB & SIND BANK",
    email: "RSSWIFTCOURIERS@GMAIL.COM",
    phone: "+91 8544970282",
    gstin: "YOUR_GSTIN_HERE",
    pan: "YOUR_PAN_HERE"
  },
  links: {
  },
};
