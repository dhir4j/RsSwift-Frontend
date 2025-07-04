
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, DollarSign, PackageCheck, SearchCheck, ShieldCheck, Zap, Loader2, Globe, CreditCard, Send, Repeat, Truck, Users, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function LandingHeader() {
  return (
    <header className="py-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b">
      <Link href="/" className="flex items-center text-primary hover:text-primary/90">
        <Image
          src="/images/rsswift_logo.png"
          alt="SwiftShip Logo"
          width={180} 
          height={45} 
          className="object-contain"
          priority 
        />
      </Link>
      <nav className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:items-center sm:space-x-2">
        <Button asChild variant="ghost" className="w-full sm:w-auto text-base sm:text-sm hover:bg-white/10">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild className="w-full sm:w-auto text-base sm:text-sm">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </nav>
    </header>
  );
}

export function LandingFooter() {
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="py-8 px-6 md:px-10 text-center border-t bg-secondary">
      <div className="container mx-auto">
        <div className="mb-4">
           <Image src="/images/rsswift_logo.png" alt="SwiftShip Footer Logo" width={150} height={40} className="object-contain mx-auto"/>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} RS SWIFT COURIERS LLP. All rights reserved.
        </p>
        <div className="mt-4 space-x-4 flex flex-wrap justify-center">
          <Link href="/about" className="text-xs text-muted-foreground hover:text-primary">About Us</Link>
          <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</Link>
          <Link href="/terms-of-service" className="text-xs text-muted-foreground hover:text-primary">Terms of Service</Link>
          <Link href="/shipping-and-delivery" className="text-xs text-muted-foreground hover:text-primary">Shipping & Delivery</Link>
          <Link href="/refund-and-cancellation" className="text-xs text-muted-foreground hover:text-primary">Refund & Cancellation</Link>
        </div>
      </div>
    </footer>
  );
}

function QuoteWidget() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const { toast } = useToast();

  const handleGetQuote = () => {
    if (!origin || !destination || !weight) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all fields to get a quote.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Quote Estimate",
      description: `Your placeholder quote for shipping ${weight}kg from ${origin} to ${destination} is ready! Sign up to get precise pricing.`,
    });
  };

  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-center">Instant Quote</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Origin Pincode" value={origin} onChange={(e) => setOrigin(e.target.value)} />
        <Input placeholder="Destination Pincode" value={destination} onChange={(e) => setDestination(e.target.value)} />
        <Input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleGetQuote}>Get Estimate</Button>
      </CardFooter>
    </Card>
  );
}

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const slideshowImages = [
    'https://placehold.co/1920x1080.png',
    'https://placehold.co/1920x1080.png',
    'https://placehold.co/1920x1080.png',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [slideshowImages.length]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  const coreFeatures = [
    {
      icon: Zap,
      title: "Easy Booking",
      description: "Schedule shipments in clicks with our intuitive platform.",
    },
    {
      icon: SearchCheck,
      title: "Real-Time Tracking",
      description: "Live tracking from pickup to delivery via Web, SMS, & Email.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Reliable",
      description: "Trust us with your valuable shipments. Safety and reliability, every step.",
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "No hidden fees. Get an instant quote for your shipment.",
    },
  ];

  const testimonials = [
      {
          name: "Rohan K.",
          role: "E-commerce Seller",
          image: "https://placehold.co/40x40.png",
          text: "SwiftShip has revolutionized our logistics. The speed and reliability are unmatched, and the real-time tracking gives us peace of mind."
      },
      {
          name: "Priya S.",
          role: "Small Business Owner",
          image: "https://placehold.co/40x40.png",
          text: "The instant quote widget is a fantastic tool. It's transparent and helps us budget our shipping costs effectively. Highly recommended!"
      },
      {
          name: "Amit V.",
          role: "Corporate Client",
          image: "https://placehold.co/40x40.png",
          text: "Their customer support is top-notch. Any issues are resolved quickly, and they are always willing to go the extra mile."
      }
  ];

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <section className="relative flex items-center justify-center text-center text-white min-h-screen px-6 md:px-10 overflow-hidden">
          <div className="absolute inset-0 w-full h-full z-0">
            {slideshowImages.map((src, index) => {
              const getTransformClass = (imageIndex: number, currentIndex: number) => {
                if (imageIndex === currentIndex) return 'translate-x-0';
                if ((currentIndex === 0 && imageIndex === slideshowImages.length - 1) || (imageIndex === currentIndex - 1)) return '-translate-x-full';
                return 'translate-x-full';
              };
              return (
                <Image
                  key={src}
                  src={src}
                  alt={`Logistics background ${index + 1}`}
                  data-ai-hint="logistics background"
                  width={1920}
                  height={1080}
                  className={cn(
                    'absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out',
                    getTransformClass(index, currentImageIndex)
                  )}
                  priority={index === 0}
                />
              );
            })}
            <div className="absolute inset-0 bg-black/60 z-10"></div>
          </div>
          
          <div className="relative z-20 container mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div className="text-left space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline">
                <span className="font-extrabold text-white drop-shadow-lg inline-block animate-fadeInUpSlo">SwiftShip</span>
                <span className="block text-2xl md:text-3xl lg:text-4xl text-gray-200 font-medium mt-1 sm:mt-2 drop-shadow-md">
                    Your Global Logistics Partner.
                </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-xl drop-shadow-sm">
                Experience seamless courier and cargo services with SwiftShip. Book, track, and manage your deliveries with unparalleled ease and confidence, worldwide.
                </p>
                <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                  <Button size="lg" asChild className="font-semibold text-lg py-3 px-8 w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
                    <Link href="/signup">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
            </div>
            <div className="flex justify-center md:justify-end">
                <QuoteWidget />
            </div>
          </div>

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
            <Link href="#features" aria-label="Scroll to features section">
              <div className="p-2 rounded-full bg-white/80 hover:bg-white/100 transition-colors animate-bounceSlo shadow-lg">
                <ChevronDown className="h-8 w-8 text-primary" />
              </div>
            </Link>
          </div>
        </section>

        <div className="bg-background text-foreground">
          <section id="features" className="px-6 md:px-10 py-16 md:py-24">
            <div className="container mx-auto">
              <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-center mb-4">
                Everything You Need for Effortless Shipping
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                SwiftShip provides a comprehensive suite of tools to make your shipping experience smooth and efficient.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {coreFeatures.map((feature) => (
                  <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
                    <CardHeader className="items-center text-center">
                      <div className="p-3 bg-primary/10 rounded-full inline-block mb-4 border border-primary/20">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="font-headline text-xl sm:text-2xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

           <section id="testimonials" className="px-6 md:px-10 py-16 md:py-24 bg-secondary">
              <div className="container mx-auto text-center">
                  <h2 className="text-3xl sm:text-4xl font-headline font-semibold mb-4">What Our Customers Say</h2>
                  <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                      Real stories from people who trust SwiftShip with their deliveries.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {testimonials.map((testimonial, index) => (
                          <Card key={index} className="text-left shadow-lg">
                              <CardContent className="p-6">
                                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                                  <div className="flex items-center gap-3">
                                      <Image src={testimonial.image} alt={testimonial.name} data-ai-hint="person avatar" width={40} height={40} className="rounded-full" />
                                      <div>
                                          <p className="font-semibold">{testimonial.name}</p>
                                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                      </div>
                                  </div>
                              </CardContent>
                          </Card>
                      ))}
                  </div>
              </div>
          </section>

        </div>

        <section className="py-16 md:py-24 px-6 md:px-10 bg-primary text-center text-primary-foreground">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-6">
              Ready to Streamline Your Shipments?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Join businesses worldwide who trust SwiftShip for their critical courier and cargo needs. Sign up today and experience the difference.
            </p>
            <Button size="lg" asChild className="font-semibold text-lg py-3 px-8 bg-background text-primary hover:bg-background/90 shadow-xl hover:shadow-2xl transition-shadow">
              <Link href="/signup">
                Create Your First Shipment <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}