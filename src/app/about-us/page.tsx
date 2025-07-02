import Header from '@/components/header';
import Footer from '@/components/footer';

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">About RS SWIFT COURIERS LLP</h1>
              <div className="space-y-4 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                <p>
                  Welcome to RS SWIFT COURIERS LLP, your most trusted partner for courier and logistics services across India. Founded with a vision to redefine the delivery experience, we are committed to providing fast, reliable, and secure shipping solutions for individuals and businesses alike.
                </p>
                <p>
                  Our journey began with a simple mission: to bridge distances by delivering packages with utmost care and efficiency. At RS SWIFT COURIERS LLP, we leverage cutting-edge technology and a robust network to ensure that your parcels reach their destination on time, every time. Our real-time tracking system provides complete transparency, giving you peace of mind from pickup to delivery.
                </p>
                <p>
                  We understand that every package is important. That's why our dedicated team of professionals handles each shipment with the highest level of priority and security. Whether it's an urgent document, a valuable item, or a large consignment, we have the expertise and infrastructure to manage it all.
                </p>
                <p>
                  Customer satisfaction is at the core of our operations. Our 24/7 support team is always ready to assist you with any queries or concerns, ensuring a seamless and hassle-free experience. We believe in building lasting relationships with our clients by consistently exceeding their expectations.
                </p>
                <p>
                  Thank you for choosing RS SWIFT COURIERS LLP. We look forward to serving you.
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
