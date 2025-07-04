
"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Package, User, ArrowRight, CheckCircle, PackagePlus, ScanLine, Globe, Home, Loader2, Edit3, Info, Wallet, IndianRupee } from 'lucide-react';
import { useShipments } from '@/hooks/use-shipments';
import type { ServiceType, CreateShipmentResponse, ShipmentTypeOption, DomesticPriceRequest, DomesticPriceResponse, InternationalPriceRequest, InternationalPriceResponse, PriceApiResponse, AddShipmentPayload, SubmitUtrPayload, SubmitUtrResponse } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { indianStatesAndUTs } from '@/lib/indian-states';
import { internationalCountryList } from '@/lib/country-list';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

const shipmentFormSchema = z.object({
  shipmentTypeOption: z.enum(["Domestic", "International"], { required_error: "Please select shipment type." }),

  senderName: z.string().min(2, "Sender name is required"),
  senderAddressLine1: z.string().min(5, "Address Line 1 is required (min 5 chars)"),
  senderAddressCity: z.string().min(2, "City is required"),
  senderAddressState: z.string().min(2, "State is required"),
  senderAddressPincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  senderAddressCountry: z.string().min(2, "Country is required").default("India"),
  senderPhone: z.string().regex(/^(\+91)?[6-9]\d{9}$/, "Invalid Indian phone number"),

  receiverName: z.string().min(2, "Receiver name is required"),
  receiverAddressLine1: z.string().min(5, "Address Line 1 is required (min 5 chars)"),
  receiverAddressCity: z.string().min(2, "City is required"),
  receiverAddressState: z.string().min(2, "State/Province is required"),
  receiverAddressPincode: z.string().regex(/^\d{3,10}$/, "Pincode/ZIP must be 3-10 digits"),
  receiverAddressCountry: z.string().min(2, "Country is required"),
  receiverPhone: z.string().min(5, "A valid phone number is required."),

  packageWeightKg: z.coerce.number().min(0.1, "Weight must be at least 0.1kg").max(100, "Max 100kg"),
  packageWidthCm: z.coerce.number().min(1, "Width must be at least 1cm").max(200, "Max 200cm"),
  packageHeightCm: z.coerce.number().min(1, "Height must be at least 1cm").max(200, "Max 200cm"),
  packageLengthCm: z.coerce.number().min(1, "Length must be at least 1cm").max(200, "Max 200cm"),
  pickupDate: z.date({ required_error: "Pickup date is required." }),

  serviceType: z.enum(["Standard", "Express"], { required_error: "Service type is required." }),
});

type ShipmentFormValues = z.infer<typeof shipmentFormSchema>;

interface PaymentStepData {
  show: boolean;
  amount: string;
  numericAmount: number | null;
  formData: ShipmentFormValues | null;
}

export function BookShipmentForm() {
  const [submissionStatus, setSubmissionStatus] = useState<Partial<CreateShipmentResponse> | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStepData>({ show: false, amount: "₹0.00", numericAmount: 0, formData: null });
  const { addShipment, isLoading: isShipmentContextLoading } = useShipments();
  const [isPricingLoading, setIsLoadingPricing] = useState(false);
  const [utr, setUtr] = useState<string>('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentFormSchema),
    defaultValues: {
      shipmentTypeOption: "Domestic",
      senderAddressCountry: 'India',
      receiverAddressCountry: 'India',
      serviceType: 'Standard',
      packageWeightKg: 0.5,
      packageWidthCm: 10,
      packageHeightCm: 10,
      packageLengthCm: 10,
      pickupDate: new Date(),
    },
  });

  const shipmentTypeOption = form.watch("shipmentTypeOption");

  useEffect(() => {
    if (user) {
      form.setValue('senderName', `${user.firstName} ${user.lastName}`);
    }
  }, [user, form]);

  useEffect(() => {
    if (shipmentTypeOption === "Domestic") {
        form.setValue("receiverAddressCountry", "India");
        form.setValue("serviceType", "Standard");
    } else if (shipmentTypeOption === "International") {
        form.setValue("serviceType", "Express");
        form.setValue("receiverAddressCountry", ""); // Use setValue to clear
    }
  }, [shipmentTypeOption, form]);

  const onSubmitToPayment = async (data: ShipmentFormValues) => {
    setIsLoadingPricing(true);
    let numericTotalPrice: number | null = null;
    try {
      if (data.shipmentTypeOption === "Domestic") {
        const payload: DomesticPriceRequest = {
          state: data.receiverAddressState,
          mode: data.serviceType.toLowerCase() as "express" | "standard",
          weight: data.packageWeightKg,
        };
        const response = await apiClient<DomesticPriceResponse>('/api/domestic/price', {
          method: 'POST', body: JSON.stringify(payload)
        });
        numericTotalPrice = response.total_price;
      } else {
        const payload: InternationalPriceRequest = {
          country: data.receiverAddressCountry,
          weight: data.packageWeightKg,
        };
        const response = await apiClient<InternationalPriceResponse>('/api/international/price', {
          method: 'POST', body: JSON.stringify(payload)
        });
        numericTotalPrice = response.total_price;
      }

      if (numericTotalPrice === null || numericTotalPrice <= 0) {
        throw new Error("Could not determine a valid price.");
      }
      setPaymentStep({ show: true, amount: `₹${numericTotalPrice.toFixed(2)}`, numericAmount: numericTotalPrice, formData: data });

    } catch (error: any) {
      toast({ title: "Pricing Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoadingPricing(false);
    }
  };

  const handleConfirmPaymentAndBook = async () => {
    if (!user?.email || !paymentStep.formData || paymentStep.numericAmount === null) return;
    if (utr.length !== 12) {
      setUtrError("UTR must be exactly 12 digits.");
      return;
    }
    
    const data = paymentStep.formData;
    const apiShipmentData: AddShipmentPayload = {
      ...data,
      sender_name: data.senderName,
      sender_address_street: data.senderAddressLine1,
      sender_address_city: data.senderAddressCity,
      sender_address_state: data.senderAddressState,
      sender_address_pincode: data.senderAddressPincode,
      sender_address_country: data.senderAddressCountry,
      sender_phone: data.senderPhone,
      receiver_name: data.receiverName,
      receiver_address_street: data.receiverAddressLine1,
      receiver_address_city: data.receiverAddressCity,
      receiver_address_state: data.receiverAddressState,
      receiver_address_pincode: data.receiverAddressPincode,
      receiver_address_country: data.receiverAddressCountry,
      receiver_phone: data.receiverPhone,
      package_weight_kg: data.packageWeightKg,
      package_width_cm: data.packageWidthCm,
      package_height_cm: data.packageHeightCm,
      package_length_cm: data.packageLengthCm,
      pickup_date: format(data.pickupDate, 'yyyy-MM-dd'),
      service_type: data.serviceType,
      final_total_price_with_tax: paymentStep.numericAmount,
      user_email: user.email,
    };
    
    try {
      const shipmentResponse = await addShipment(apiShipmentData);
      const utrPayload: SubmitUtrPayload = {
        shipment_id_str: shipmentResponse.shipment_id_str,
        utr,
        amount: paymentStep.numericAmount,
      };
      await apiClient<SubmitUtrResponse>('/api/payments', { method: 'POST', body: JSON.stringify(utrPayload) });
      setSubmissionStatus(shipmentResponse);
      toast({ title: "Submission Successful!", description: `UTR for shipment ${shipmentResponse.shipment_id_str} submitted.` });
      form.reset();
      setPaymentStep({ show: false, amount: "₹0.00", numericAmount: 0, formData: null });
      setUtr('');
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    }
  };

  if (submissionStatus?.shipment_id_str) {
    return (
      <Alert className="border-green-500 bg-green-50/50 text-green-700">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <AlertTitle className="font-headline text-green-800">Payment Submitted for Review</AlertTitle>
        <AlertDescription>
          <p className="text-green-700">{submissionStatus.message}</p>
          <p className="text-green-700">Shipment ID: <strong>{submissionStatus.shipment_id_str}</strong></p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => setSubmissionStatus(null)} variant="outline">Book Another</Button>
            <Button asChild><Link href="/dashboard/my-payments">View Payments</Link></Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (paymentStep.show && paymentStep.formData) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ScanLine className="h-6 w-6 text-primary" /> Complete Payment</CardTitle>
          <CardDescription>Scan to pay, then enter the UTR to confirm.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">Amount to Pay</p>
          <p className="text-4xl font-bold text-primary">{paymentStep.amount}</p>
          <Image src="/images/qr-code.png" alt="QR Code" width={200} height={200} className="mx-auto rounded-md border" />
          <div className="text-left space-y-1">
            <Label htmlFor="utrInput" className="font-semibold">Enter 12-digit UTR Number</Label>
            <Input id="utrInput" value={utr} onChange={(e) => { setUtr(e.target.value.replace(/\D/g, '').slice(0, 12)); setUtrError(null); }} placeholder="UTR from payment app" maxLength={12} />
            {utrError && <p className="text-sm text-destructive mt-1">{utrError}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={handleConfirmPaymentAndBook} className="w-full" disabled={isShipmentContextLoading}>
            {isShipmentContextLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Submit for Review
          </Button>
          <Button variant="ghost" onClick={() => setPaymentStep({ ...paymentStep, show: false })} className="w-full">Back to Form</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><PackagePlus className="h-6 w-6 text-primary" /> Book a New Shipment</CardTitle>
        <CardDescription>Fill in the details to schedule your shipment.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitToPayment)} className="space-y-8">
            <FormField control={form.control} name="shipmentTypeOption" render={({ field }) => (
              <FormItem className="space-y-3"><FormLabel className="font-semibold">Shipment Type</FormLabel><FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Domestic" /></FormControl><FormLabel className="font-normal flex items-center gap-2"><Home /> Domestic</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="International" /></FormControl><FormLabel className="font-normal flex items-center gap-2"><Globe /> International</FormLabel></FormItem>
                </RadioGroup></FormControl><FormMessage /></FormItem>
            )} />

            {shipmentTypeOption && (
              <>
                {/* Sender Details */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><User /> Sender Details</h3>
                  <FormField control={form.control} name="senderName" render={({ field }) => ( <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="senderAddressLine1" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="senderAddressCity" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="senderAddressState" render={({ field }) => ( <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="senderAddressPincode" render={({ field }) => ( <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <FormField control={form.control} name="senderPhone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>

                {/* Receiver Details */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><User /> Receiver Details</h3>
                  <FormField control={form.control} name="receiverName" render={({ field }) => ( <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="receiverAddressLine1" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="receiverAddressCity" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="receiverAddressState" render={({ field }) => ( <FormItem><FormLabel>State/Province</FormLabel>
                      {shipmentTypeOption === "Domestic" ? (
                        <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger></FormControl><SelectContent>{indianStatesAndUTs.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                      ) : (<Input {...field} />)
                      }<FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="receiverAddressPincode" render={({ field }) => ( <FormItem><FormLabel>Pincode/ZIP</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                   <FormField control={form.control} name="receiverAddressCountry" render={({ field }) => ( <FormItem><FormLabel>Country</FormLabel>
                      {shipmentTypeOption === "International" ? (
                         <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger></FormControl><SelectContent>{internationalCountryList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                      ) : (<Input {...field} disabled />)
                      }<FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="receiverPhone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>

                {/* Package & Service */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Package /> Package & Service</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <FormField control={form.control} name="packageWeightKg" render={({ field }) => ( <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="packageLengthCm" render={({ field }) => ( <FormItem><FormLabel>Length (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="packageWidthCm" render={({ field }) => ( <FormItem><FormLabel>Width (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="packageHeightCm" render={({ field }) => ( <FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="pickupDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Pickup Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                      <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                      </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="serviceType" render={({ field }) => ( <FormItem><FormLabel>Service Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={shipmentTypeOption === "International"}><FormControl><SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Standard">Standard</SelectItem><SelectItem value="Express">Express</SelectItem></SelectContent></Select>
                      {shipmentTypeOption === 'International' && <p className="text-xs text-muted-foreground flex items-center gap-1"><Info size={14} /> International ships Express.</p>}
                      <FormMessage /></FormItem>
                    )} />
                  </div>
                </div>

                <CardFooter className="p-0 pt-6">
                  <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isPricingLoading}>
                    {isPricingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Calculate Price & Proceed
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
