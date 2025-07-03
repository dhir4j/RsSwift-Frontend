"use client"

import Link from "next/link"
import { Package2, Menu, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { isLoggedIn, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center gap-2" prefetch={false}>
          <Package2 className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">RS SWIFT COURIERS LLP</span>
        </Link>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/#services" className="text-muted-foreground transition-colors hover:text-foreground" prefetch={false}>
            Services
          </Link>
          <Link href="/#testimonials" className="text-muted-foreground transition-colors hover:text-foreground" prefetch={false}>
            Testimonials
          </Link>
          <Link href="/#contact" className="text-muted-foreground transition-colors hover:text-foreground" prefetch={false}>
            Contact
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          {isLoggedIn ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/dashboard/my-shipments">My Shipments</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium pt-8">
                <Link href="/#services" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Services
                </Link>
                <Link href="/#testimonials" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Testimonials
                </Link>
                <Link href="/#contact" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Contact
                </Link>
                <div className="border-t pt-6 mt-4">
                 {isLoggedIn ? (
                    <Button onClick={handleLogout} className="w-full">Logout</Button>
                 ) : (
                    <div className="grid gap-4">
                        <Button variant="ghost" asChild className="w-full"><Link href="/login">Sign In</Link></Button>
                        <Button asChild className="w-full"><Link href="/register">Register</Link></Button>
                    </div>
                 )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
