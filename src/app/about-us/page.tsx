
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Target, Eye, ShieldCheck, Zap, Users } from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      icon: ShieldCheck,
      title: "Reliability",
      description: "We are committed to delivering your packages safely and on time, every single time. Trust is the foundation of our service."
    },
    {
      icon: Zap,
      title: "Efficiency",
      description: "Leveraging cutting-edge technology and optimized logistics, we provide the fastest and most effective shipping solutions."
    },
    {
      icon: Users,
      title: "Customer-Centric",
      description: "Our customers are at the heart of everything we do. We strive to provide an exceptional and seamless experience."
    }
  ];

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-secondary">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline animate-enter">
                Connecting India, One Parcel at a Time.
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl animate-enter" style={{animationDelay: '200ms'}}>
                RS Swift Couriers LLP is redefining the logistics landscape with a commitment to speed, security, and superior customer service.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-4 animate-enter" style={{animationDelay: '300ms'}}>
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium font-headline">
                  Our Story
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">From a Simple Idea to a Nationwide Network</h2>
                <p className="text-muted-foreground md:text-lg/relaxed">
                  Our journey began with a simple mission: to bridge distances by delivering packages with utmost care and efficiency. We saw the need for a courier service that wasn't just about transport, but about trust and transparency.
                </p>
                <p className="text-muted-foreground md:text-lg/relaxed">
                  Today, RS Swift Couriers LLP leverages cutting-edge technology and a robust network to ensure that your parcels reach their destination on time, every time. Our real-time tracking system provides complete visibility, giving you peace of mind from pickup to delivery.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 animate-enter" style={{animationDelay: '400ms'}}>
                 <div className="space-y-4">
                    <Card className="p-6">
                      <Target className="w-10 h-10 text-primary mb-4" />
                      <h3 className="text-xl font-bold font-headline">Our Mission</h3>
                      <p className="text-muted-foreground mt-2 text-sm">To provide fast, reliable, and secure shipping solutions for individuals and businesses across India.</p>
                    </Card>
                 </div>
                 <div className="space-y-4 pt-8">
                   <Card className="p-6">
                      <Eye className="w-10 h-10 text-primary mb-4" />
                      <h3 className="text-xl font-bold font-headline">Our Vision</h3>
                      <p className="text-muted-foreground mt-2 text-sm">To be India's most trusted logistics partner, recognized for our innovation and commitment to customer success.</p>
                    </Card>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="space-y-4 text-center max-w-2xl mx-auto mb-12">
               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline animate-enter">
                  What Drives Us
               </h2>
               <p className="text-muted-foreground md:text-lg animate-enter" style={{animationDelay: '200ms'}}>
                  Our core values guide every decision we make and every package we deliver.
               </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3">
              {values.map((value, index) => (
                <div key={value.title} className="flex flex-col items-center text-center gap-4 animate-enter" style={{animationDelay: `${300 + index * 100}ms`}}>
                  <div className="bg-primary/10 p-4 rounded-full">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-headline">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-28">
            <div className="container px-4 md:px-6 text-center">
                 <div className="max-w-2xl mx-auto space-y-4 animate-enter">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                        Ready to Ship with a Partner You Can Trust?
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                        Experience the RS Swift Couriers LLP difference today. Get started with your first shipment in minutes.
                    </p>
                    <Button size="lg" asChild className="mt-4">
                        <Link href="/register">
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
