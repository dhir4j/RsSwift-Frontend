"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageSquare, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="shadow-xl overflow-hidden">
        <div>
          <div className="p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center gap-2">
                <MessageSquare className="h-8 w-8 text-primary" /> Get In Touch
              </CardTitle>
              <CardDescription>We're here to help! Reach out to us through any of the channels below.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Email Support</h4>
                  <p className="text-muted-foreground">Send us an email for any inquiries.</p>
                  <a href="mailto:RSSWIFTCOURIERS@GMAIL.COM" className="text-primary hover:underline">RSSWIFTCOURIERS@GMAIL.COM</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Phone Support</h4>
                  <p className="text-muted-foreground">Call us for immediate assistance.</p>
                  <a href="tel:+918544970282" className="text-primary hover:underline">+91 8544970282</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Office Address</h4>
                  <p className="text-muted-foreground">18AX MODEL TOWN EXTENSION LUDHIANA NEAR PUNJAB & SIND BANK</p>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
