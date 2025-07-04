
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TermsOfServicePage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" /> Terms of Service
          </CardTitle>
          {lastUpdated && <CardDescription>Last updated: {lastUpdated}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Welcome to SwiftShip! These terms and conditions outline the rules and regulations for the use of RS SWIFT COURIERS LLP's Website, located at this application's domain.</p>
          <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use SwiftShip if you do not agree to take all of the terms and conditions stated on this page.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">1. Accounts</h2>
          <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. License</h2>
          <p>Unless otherwise stated, RS SWIFT COURIERS LLP and/or its licensors own the intellectual property rights for all material on SwiftShip. All intellectual property rights are reserved. You may access this from SwiftShip for your own personal use subjected to restrictions set in these terms and conditions.</p>
          <p>You must not:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Republish material from SwiftShip</li>
            <li>Sell, rent or sub-license material from SwiftShip</li>
            <li>Reproduce, duplicate or copy material from SwiftShip</li>
            <li>Redistribute content from SwiftShip</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. Prohibited Items</h2>
          <p>Users are prohibited from shipping certain items through SwiftShip. This includes, but is not limited to:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Illegal substances, narcotics, and psychotropic drugs.</li>
            <li>Explosives, firearms, ammunition, and other weaponry.</li>
            <li>Hazardous materials, toxic substances, and radioactive materials.</li>
            <li>Perishable goods that require special handling or temperature control not explicitly supported by our services.</li>
            <li>Live animals (except as permitted under specific service agreements and regulations).</li>
            <li>Valuables such as gold, silver, precious stones, currency, and negotiable instruments.</li>
            <li>Any item that is prohibited by law or regulation in the origin or destination country.</li>
          </ul>
          <p>RS SWIFT COURIERS LLP reserves the right to refuse, hold, or return any shipment that is found to contain prohibited items. Users may be liable for any damages or costs incurred due to the shipment of prohibited items.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">4. Limitation of Liability</h2>
          <p>In no event shall RS SWIFT COURIERS LLP, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this application whether such liability is under contract. RS SWIFT COURIERS LLP, including its officers, directors,and employees shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">5. Service Availability</h2>
          <p>This application is provided "as is" and "as available" without any warranties, express or implied. We do not guarantee that the service will always be available, uninterrupted, or error-free.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">6. Governing Law</h2>
          <p>Any claim relating to SwiftShip's website shall be governed by the laws of India without regard to its conflict of law provisions.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">7. Changes to Terms</h2>
          <p>RS SWIFT COURIERS LLP reserves the right to revise these terms at any time as it sees fit, and by using this Website you are expected to review these terms on a regular basis.</p>

        </CardContent>
      </Card>
    </div>
  );
}
