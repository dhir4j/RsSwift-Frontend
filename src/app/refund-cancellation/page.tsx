import Header from '@/components/header';
import Footer from '@/components/footer';

export default function RefundCancellation() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Refund & Cancellation Policy</h1>
              <div className="space-y-4 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                <p>This policy details the terms and conditions for cancellations and refunds for services availed from RS SWIFT COURIERS.</p>

                <h2 className="text-2xl font-bold font-headline mt-6">1. Cancellation Policy</h2>
                <p>You can cancel your shipment booking under the following conditions:</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li><strong>Before Pickup:</strong> A booking can be cancelled any time before the package has been picked up by our courier agent. A full refund of the shipping charges will be processed.</li>
                  <li><strong>After Pickup:</strong> Once a package has been picked up, the booking cannot be cancelled, and no refund will be issued for the shipping charges.</li>
                </ul>
                <p>To cancel a booking, please contact our customer care team at +91 9541195406 or email us at RSSWIFTCOURIERS@GMAIL.COM with your booking details.</p>

                <h2 className="text-2xl font-bold font-headline mt-6">2. Refund Policy</h2>
                <p>Refunds are applicable in the following scenarios:</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li><strong>Booking Cancellation:</strong> As mentioned above, a full refund is provided if the booking is cancelled before pickup.</li>
                  <li><strong>Service Failure:</strong> In the rare event of a service failure from our end (e.g., loss of package, significant damage attributable to our handling), a refund of the shipping charges and compensation as per our liability terms will be processed. An investigation will be conducted to determine the cause and eligibility for the refund.</li>
                  <li><strong>Overcharging:</strong> If you have been overcharged due to a technical or manual error, the excess amount will be refunded to you.</li>
                </ul>

                <h2 className="text-2xl font-bold font-headline mt-6">3. Refund Process</h2>
                <p>Once a refund is approved, the amount will be credited back to the original mode of payment within 7-10 business days. You will be notified via email once the refund has been processed.</p>

                <h2 className="text-2xl font-bold font-headline mt-6">4. Non-refundable Charges</h2>
                <p>Certain charges, such as insurance premiums or special handling fees, may be non-refundable. Please check the specific terms at the time of booking.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
