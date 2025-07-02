import Link from "next/link"
import { Package2, Twitter, Facebook, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer id="contact" className="bg-secondary text-secondary-foreground">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <Package2 className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="text-xl font-bold font-headline">SwiftShip</span>
                <span className="text-xs text-muted-foreground">by RS SWIFT COURIERS LLP</span>
              </div>
            </Link>
            <p className="text-sm">Your trusted partner for swift and secure deliveries across India.</p>
          </div>
          <div className="grid gap-2 text-sm">
            <h3 className="font-bold text-base font-headline">Quick Links</h3>
            <Link href="/#services" className="hover:text-primary hover:underline" prefetch={false}>
              Services
            </Link>
            <Link href="/#testimonials" className="hover:text-primary hover:underline" prefetch={false}>
              Testimonials
            </Link>
            <Link href="/#home" className="hover:text-primary hover:underline" prefetch={false}>
              Get a Quote
            </Link>
          </div>
          <div className="grid gap-2 text-sm">
            <h3 className="font-bold text-base font-headline">Contact Us</h3>
            <p>123 Delivery Lane, New Delhi, 110001, India</p>
            <a href="mailto:contact@swiftship.co.in" className="hover:text-primary hover:underline">
              contact@swiftship.co.in
            </a>
            <a href="tel:+919876543210" className="hover:text-primary hover:underline">
              +91 98765 43210
            </a>
          </div>
          <div className="grid gap-2 text-sm">
            <h3 className="font-bold text-base font-headline">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} RS SWIFT COURIERS LLP. All rights reserved.
        </div>
      </div>
    </footer>
  )
}