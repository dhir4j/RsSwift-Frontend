import Header from '@/components/header';
import Footer from '@/components/footer';

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Terms of Service</h1>
              <div className="space-y-4 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                <p><strong>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
                
                <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using our website (the "Service") operated by RS SWIFT COURIERS LLP ("us", "we", or "our").</p>

                <h2 className="text-2xl font-bold font-headline mt-6">1. Agreement to Terms</h2>
                <p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>

                <h2 className="text-2xl font-bold font-headline mt-6">2. Services</h2>
                <p>RS SWIFT COURIERS LLP provides courier and logistics services. By placing an order through our website, you are offering to purchase a service on and subject to the following terms and conditions. All orders are subject to availability and confirmation of the order price.</p>

                <h2 className="text-2xl font-bold font-headline mt-6">3. User Obligations</h2>
                <p>You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Service in any way that could damage the Service, the reputation of RS SWIFT COURIERS LLP, or the general business of RS SWIFT COURIERS LLP. You further agree not to use the Service to send any prohibited items as per Indian law and our company policy.</p>

                <h2 className="text-2xl font-bold font-headline mt-6">4. Limitation of Liability</h2>
                <p>In no event shall RS SWIFT COURIERS LLP, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

                <h2 className="text-2xl font-bold font-headline mt-6">5. Governing Law</h2>
                <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6">6. Changes</h2>
                <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
