
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, ShieldCheck, Search, Headphones, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function LandingHeader() {
  return (
    <header className="py-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90">
        <Image
          src="/images/rsswift_logo.png"
          alt="SwiftShip Logo"
          width={150} 
          height={40} 
          className="object-contain"
          priority 
        />
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
          <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</Link>
      </nav>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up Free</Link>
        </Button>
      </div>
    </header>
  );
}

export function LandingFooter() {
    const [currentYear, setCurrentYear] = useState('');

    useEffect(() => {
        setCurrentYear(new Date().getFullYear().toString());
    }, []);

    return (
        <footer className="bg-secondary text-secondary-foreground">
            <div className="container mx-auto px-6 md:px-10 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Image
                                src="/images/rsswift_logo.png"
                                alt="SwiftShip Footer Logo"
                                width={150}
                                height={40}
                                className="object-contain"
                            />
                        </Link>
                        <p className="text-sm max-w-xs text-muted-foreground">
                            Reliable shipping, redefined. Fast, secure, and transparent courier services designed for you.
                        </p>
                    </div>
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/about-us" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Press</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Services</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/dashboard/book-shipment" className="text-muted-foreground hover:text-foreground">Domestic</Link></li>
                                <li><Link href="/dashboard/book-shipment" className="text-muted-foreground hover:text-foreground">International</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Business Solutions</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                                <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                                <li><Link href="/shipping-delivery" className="text-muted-foreground hover:text-foreground">Shipping Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/customer-care" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
                                <li><Link href="/dashboard/track-shipment" className="text-muted-foreground hover:text-foreground">Track Package</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                    &copy; {currentYear} RS SWIFT COURIERS LLP. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);


  if (isLoading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const features = [
    {
      icon: Zap,
      title: "Speed & Efficiency",
      description: "Optimized routes and express options ensure your packages arrive on time, every time.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Insured",
      description: "Every shipment is handled with care and protected with comprehensive insurance.",
    },
    {
      icon: Search,
      title: "Transparent Tracking",
      description: "Follow your package's journey from pickup to delivery with our real-time tracking.",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "Our customer service team is available 24/7 to assist you with any questions.",
    },
  ];

  const testimonials = [
      {
          name: "Rohan Kapoor",
          role: "E-commerce Store Owner",
          avatar: "RK",
          text: "Switching to SwiftShip was the best decision for my business. Their reliability and speed have significantly improved my customer satisfaction."
      },
      {
          name: "Anjali Sharma",
          role: "Small Business Owner",
          avatar: "AS",
          text: "The platform is so easy to use, and the transparent pricing is a breath of fresh air. I can finally manage my shipping without any headaches."
      },
      {
          name: "Vikram Mehta",
          role: "Logistics Manager",
          avatar: "VM",
          text: "Impressive service. The real-time tracking is accurate, and their support team is always helpful and responsive. Highly recommended for businesses."
      }
  ];

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background -z-10"></div>
            <div className="container mx-auto px-6 md:px-10 py-24 sm:py-32 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter text-foreground animate-enter" style={{ animationDelay: '100ms' }}>
                        Reliable Shipping, <span className="text-primary">Redefined</span>.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-enter" style={{ animationDelay: '250ms' }}>
                       Fast, secure, and transparent courier services designed for individuals and businesses. Ship with confidence, track with ease.
                    </p>
                    <div className="mt-10 flex justify-center gap-4 animate-enter" style={{ animationDelay: '400ms' }}>
                        <Button size="lg" asChild className="font-semibold text-lg py-3 px-8 shadow-lg hover:shadow-xl transition-shadow">
                            <Link href="/signup">
                            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                         <Button size="lg" variant="outline" asChild className="font-semibold text-lg py-3 px-8">
                            <Link href="/dashboard/track-shipment">
                            Track a Package
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-background">
             <div className="container mx-auto px-6 md:px-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold font-headline tracking-tight animate-enter">Why Choose SwiftShip?</h2>
                    <p className="mt-4 text-lg text-muted-foreground animate-enter" style={{ animationDelay: '150ms' }}>
                        We provide a seamless shipping experience backed by powerful features and a commitment to reliability.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="text-center p-6 bg-card rounded-xl border border-transparent hover:border-primary/20 hover:shadow-lg transition-all duration-300 animate-enter" style={{ animationDelay: `${200 + index * 100}ms` }}>
                    <div className="flex justify-center items-center mb-5">
                       <div className="bg-primary/10 p-4 rounded-full">
                         <feature.icon className="h-8 w-8 text-primary" />
                       </div>
                    </div>
                    <h3 className="text-xl font-semibold font-headline mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
             </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-20 md:py-28 bg-secondary">
            <div className="container mx-auto px-6 md:px-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold font-headline tracking-tight animate-enter">Three Simple Steps to Ship</h2>
                    <p className="mt-4 text-lg text-muted-foreground animate-enter" style={{ animationDelay: '150ms' }}>Our streamlined process makes sending packages easier than ever.</p>
                </div>
                <div className="relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                         <div className="text-center animate-enter" style={{ animationDelay: '200ms' }}>
                            <div className="relative mb-6">
                                <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold font-headline">1</div>
                            </div>
                            <h3 className="text-xl font-semibold font-headline mb-2">Book Online</h3>
                            <p className="text-muted-foreground">Enter shipment details and get an instant price quote on our user-friendly platform.</p>
                        </div>
                         <div className="text-center animate-enter" style={{ animationDelay: '350ms' }}>
                            <div className="relative mb-6">
                                <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold font-headline">2</div>
                            </div>
                            <h3 className="text-xl font-semibold font-headline mb-2">We Pick Up</h3>
                            <p className="text-muted-foreground">Schedule a convenient pickup time, and our courier will collect the package from your doorstep.</p>
                        </div>
                         <div className="text-center animate-enter" style={{ animationDelay: '500ms' }}>
                            <div className="relative mb-6">
                                <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold font-headline">3</div>
                            </div>
                            <h3 className="text-xl font-semibold font-headline mb-2">Track & Deliver</h3>
                            <p className="text-muted-foreground">Monitor your package's journey in real-time until it is safely delivered to its destination.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-6 md:px-10">
                 <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold font-headline tracking-tight animate-enter">Trusted by Businesses and Individuals</h2>
                    <p className="mt-4 text-lg text-muted-foreground animate-enter" style={{ animationDelay: '150ms' }}>See what our satisfied customers have to say about their experience with SwiftShip.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {testimonials.map((testimonial, index) => (
                        <Card key={index} className="flex flex-col justify-between animate-enter" style={{ animationDelay: `${200 + index * 100}ms` }}>
                            <CardContent className="p-6">
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                                </div>
                                <blockquote className="text-muted-foreground italic">"{testimonial.text}"</blockquote>
                            </CardContent>
                            <CardHeader className="p-6 pt-0 flex flex-row items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container mx-auto px-6 md:px-10 text-center max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold font-headline mb-6 text-foreground animate-enter">
              Ready to Ship with Confidence?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 animate-enter" style={{ animationDelay: '150ms' }}>
              Create an account in minutes and join thousands of satisfied customers who trust SwiftShip for their critical deliveries.
            </p>
            <Button size="lg" asChild className="font-semibold text-lg py-3 px-8 shadow-xl hover:shadow-2xl transition-shadow animate-enter" style={{ animationDelay: '300ms' }}>
              <Link href="/signup">
                Sign Up for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
