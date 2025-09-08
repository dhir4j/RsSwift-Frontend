
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="space-y-6 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Contact Us</h1>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We are here to help. Reach out to us through any of the channels below, and our team will be happy to assist you.
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl items-start gap-8 py-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-12">
              <div className="flex flex-col items-center text-center gap-4 p-6 rounded-lg border shadow-sm">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Phone Support</h3>
                <p className="text-muted-foreground">Speak directly to our support team for immediate assistance.</p>
                <a href="tel:+918544970282" className="font-semibold text-primary hover:underline">
                  +91 8544970282
                </a>
              </div>
              <div className="flex flex-col items-center text-center gap-4 p-6 rounded-lg border shadow-sm">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Email Support</h3>
                <p className="text-muted-foreground">Send us an email with your queries, and we'll get back to you promptly.</p>
                <a href="mailto:RSSWIFTCOURIERS@GMAIL.COM" className="font-semibold text-primary hover:underline">
                  RSSWIFTCOURIERS@GMAIL.COM
                </a>
              </div>
              <div className="flex flex-col items-center text-center gap-4 p-6 rounded-lg border shadow-sm">
                <div className="bg-primary/10 p-4 rounded-full">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Office Address</h3>
                <p className="text-muted-foreground">Visit us at our corporate office for in-person inquiries.</p>
                <p className="font-semibold text-primary">18AX MODEL TOWN EXTENSION LUDHIANA NEAR PUNJAB & SIND BANK</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
