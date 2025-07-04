import Header from '@/components/header';
import Footer from '@/components/footer';
import FeatureGrid from '@/components/feature-grid';
import Testimonials from '@/components/testimonials';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section id="home" className="w-full py-24 md:py-32 lg:py-40 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-1000 ease-out">
                  RS SWIFT COURIERS
                </h1>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-1000 delay-200 ease-out fill-mode-backwards">
                  India's Trusted Courier Partner
                </h2>
                <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-1000 delay-400 ease-out fill-mode-backwards">
                  Fast, reliable, and secure delivery services with 24x7 support. Ship anything, anywhere in India with confidence.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-1000 delay-600 ease-out fill-mode-backwards">
                  <Button asChild size="lg">
                    <Link href="/register">
                      Register Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-[800ms] ease-out fill-mode-backwards">
                  <ArrowDown className="h-8 w-8 text-muted-foreground animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline animate-in fade-in slide-in-from-bottom-6 duration-700">Why Choose RS SWIFT COURIERS?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                  We are committed to providing top-notch courier services with a focus on speed, safety, and customer satisfaction.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4">
                <FeatureGrid />
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline animate-in fade-in slide-in-from-bottom-6 duration-700">Loved by Our Customers</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                  Hear what our satisfied clients have to say about their experience with RS SWIFT COURIERS.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-6xl mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
              <Testimonials />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
