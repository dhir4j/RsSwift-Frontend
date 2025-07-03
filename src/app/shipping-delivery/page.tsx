import Header from '@/components/header';
import Footer from '@/components/footer';

export default function ShippingDelivery() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Shipping & Delivery Policy</h1>
              <div className="space-y-4 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                <p>At RS SWIFT COURIERS, we are dedicated to ensuring your packages are delivered efficiently and securely. This policy outlines our shipping and delivery procedures.</p>

                <h2 className="text-2xl font-bold font-headline mt-6">1. Service Areas</h2>
                <p>We offer nationwide coverage across India, including metropolitan cities, towns, and remote areas. Please use our website's quote widget to confirm serviceability for specific pincodes.</p>

                <h2 className="text-2xl font-bold font-headline mt-6">2. Delivery Times</h2>
                <p>
                  Delivery times are estimates and may vary depending on the destination, package size, and service type selected.
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li><strong>Express Delivery:</strong> 1-2 business days for metropolitan areas, 2-4 business days for other locations.</li>
                    <li><strong>Standard Delivery:</strong> 3-5 business days for metropolitan areas, 5-7 business days for other locations.</li>
                  </ul>
                  Please note that delivery times are calculated from the day of dispatch. Business days do not include Sundays and public holidays.
                </p>

                <h2 className="text-2xl font-bold font-headline mt-6">3. Shipping Charges</h2>
                <p>Shipping charges are calculated based on the package's weight, dimensions, origin, and destination. You can get an instant estimate using the quote widget on our homepage. The final cost will be confirmed at the time of booking.</p>

                <h2 className="text-2xl font-bold font-headline mt-6">4. Tracking</h2>
                <p>Once your shipment is dispatched, you will receive a tracking number via email and SMS. You can use this number to track your package in real-time on our website.</p>

                <h2 className="text-2xl font-bold font-headline mt-6">5. Undeliverable Shipments</h2>
                <p>If a shipment is undeliverable due to an incorrect address, recipient unavailability, or other reasons, our team will attempt to contact the sender or recipient to resolve the issue. Additional charges may apply for re-delivery attempts or if the package needs to be returned to the sender.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
