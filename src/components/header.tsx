"use client"

import Link from "next/link"
import { Package2, Menu, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"

export default function Header() {
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
          <Button asChild>
            <Link href="/#home">
              Get a Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium pt-8">
                <Link href="/#services" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
                  Services
                </Link>
                <Link href="/#testimonials" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Testimonials
                </Link>
                <Link href="/#contact" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
