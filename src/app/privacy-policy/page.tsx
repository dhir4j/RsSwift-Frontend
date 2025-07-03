import Header from '@/components/header';
import Footer from '@/components/footer';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Privacy Policy</h1>
              <div className="space-y-4 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                <p><strong>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
                
                <h2 className="text-2xl font-bold font-headline mt-6">1. Information We Collect</h2>
                <p>
                  RS SWIFT COURIERS ("we," "our," or "us") collects information that you provide directly to us when you use our services. This may include:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Personal identification information (Name, email address, phone number, address).</li>
                    <li>Shipment details (Origin, destination, weight, dimensions, contents).</li>
                    <li>Payment information (Credit/debit card details, billing address).</li>
                    <li>Information you provide when you contact our customer support.</li>
                  </ul>
                </p>

                <h2 className="text-2xl font-bold font-headline mt-6">2. How We Use Your Information</h2>
                <p>
                  We use the information we collect to:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Provide, maintain, and improve our services.</li>
                    <li>Process transactions and send you related information, including confirmations and invoices.</li>
                    <li>Communicate with you about your shipments, services, offers, and promotions.</li>
                    <li>Respond to your comments, questions, and requests and provide customer service.</li>
                    <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
                  </ul>
                </p>

                <h2 className="text-2xl font-bold font-headline mt-6">3. Sharing of Information</h2>
                <p>
                  We do not share your personal information with third parties except as described in this Privacy Policy. We may share your information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf. We may also share information in response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.
                </p>

                <h2 className="text-2xl font-bold font-headline mt-6">4. Security</h2>
                <p>
                  We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                </p>

                <h2 className="text-2xl font-bold font-headline mt-6">5. Your Choices</h2>
                <p>
                  You may update, correct or delete information about you at any time by logging into your online account or emailing us at RSSWIFTCOURIERS@GMAIL.COM. If you wish to delete or deactivate your account, please email us, but note that we may retain certain information as required by law or for legitimate business purposes.
                </p>
                
                <h2 className="text-2xl font-bold font-headline mt-6">6. Changes to This Policy</h2>
                <p>
                  We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
