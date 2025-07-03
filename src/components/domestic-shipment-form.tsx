"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

const formSchema = z.object({
  // Sender
  senderName: z.string().min(2, "Name is required"),
  senderAddress: z.string().min(10, "Full address is required"),
  senderCity: z.string().min(2, "City is required"),
  senderState: z.string().min(2, "State is required"),
  senderPincode: z.string().length(6, "Must be a 6-digit pincode"),
  senderPhone: z.string().length(10, "Must be a 10-digit phone number"),
  // Receiver
  receiverName: z.string().min(2, "Name is required"),
  receiverAddress: z.string().min(10, "Full address is required"),
  receiverCity: z.string().min(2, "City is required"),
  receiverState: z.string().min(2, "State is required"),
  receiverPincode: z.string().length(6, "Must be a 6-digit pincode"),
  receiverPhone: z.string().length(10, "Must be a 10-digit phone number"),
  // Product
  serviceType: z.string({ required_error: "Please select a service mode." }),
  productDescription: z.string().min(5, "Description must be at least 5 characters"),
  weight: z.coerce.number().min(0.1, "Weight must be at least 0.1kg"),
  length: z.coerce.number().min(1, "Length is required"),
  width: z.coerce.number().min(1, "Width is required"),
  height: z.coerce.number().min(1, "Height is required"),
})

interface PriceData {
    total_price: number;
}

export default function DomesticShipmentForm() {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const [priceData, setPriceData] = useState<PriceData | null>(null);
    const [isPriceLoading, setIsPriceLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    const handleCalculatePrice = async () => {
        const { receiverState, serviceType, weight } = form.getValues();
        if (!receiverState || !serviceType || !weight) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please fill in Receiver's State, Service Mode, and Weight to calculate the price.",
            });
            return;
        }

        setIsPriceLoading(true);
        setApiError(null);
        setPriceData(null);
        try {
            const response = await fetch('https://www.server.shedloadoverseas.com/api/domestic/price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: receiverState, mode: serviceType, weight }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to calculate price.');
            }
            setPriceData(data);
        } catch (error: any) {
            setApiError(error.message);
        } finally {
            setIsPriceLoading(false);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user || !priceData) {
            setApiError("User not authenticated or price not calculated. Please try again.");
            return;
        }
        setIsSubmitting(true);
        setApiError(null);

        const payload = {
            sender_name: values.senderName,
            sender_address_street: values.senderAddress,
            sender_address_city: values.senderCity,
            sender_address_state: values.senderState,
            sender_address_pincode: values.senderPincode,
            sender_address_country: "India",
            sender_phone: values.senderPhone,
            receiver_name: values.receiverName,
            receiver_address_street: values.receiverAddress,
            receiver_address_city: values.receiverCity,
            receiver_address_state: values.receiverState,
            receiver_address_pincode: values.receiverPincode,
            receiver_address_country: "India",
            receiver_phone: values.receiverPhone,
            package_weight_kg: values.weight,
            package_length_cm: values.length,
            package_width_cm: values.width,
            package_height_cm: values.height,
            pickup_date: new Date().toISOString().split('T')[0],
            service_type: values.serviceType,
            final_total_price_with_tax: priceData.total_price,
            user_email: user.email,
        };

        try {
            const response = await fetch('https://www.server.shedloadoverseas.com/api/shipments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to create shipment.');
            }
            toast({
                title: "Shipment Initiated!",
                description: "Redirecting to payment page...",
            });
            router.push(`/payment?shipmentId=${result.shipment_id_str}&amount=${priceData.total_price}`);
        } catch (error: any) {
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Sender Details */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Sender Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="senderName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="senderPhone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <FormField control={form.control} name="senderAddress" render={({ field }) => (
                <FormItem><FormLabel>Full Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="senderCity" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="senderState" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="senderPincode" render={({ field }) => (
                    <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
        </div>

        {/* Receiver Details */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Receiver Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="receiverName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="receiverPhone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <FormField control={form.control} name="receiverAddress" render={({ field }) => (
                <FormItem><FormLabel>Full Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="receiverCity" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="receiverState" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="receiverPincode" render={({ field }) => (
                    <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
        </div>
        
        {/* Product Details */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Product & Service Details</h3>
            <FormField control={form.control} name="productDescription" render={({ field }) => (
                <FormItem><FormLabel>Description of Contents</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="weight" render={({ field }) => (
                    <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="serviceType" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Service Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="express">Express</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <div></div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="length" render={({ field }) => (
                    <FormItem><FormLabel>Length (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="width" render={({ field }) => (
                    <FormItem><FormLabel>Width (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="height" render={({ field }) => (
                    <FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
        </div>
        
        <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-lg font-medium">Price Calculation</h3>
            <div className="flex items-center gap-4">
                 <Button type="button" onClick={handleCalculatePrice} disabled={isPriceLoading}>
                    {isPriceLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Calculate Price
                </Button>
                {priceData && (
                    <div className="text-lg font-semibold text-primary">
                        Estimated Price: ₹{priceData.total_price.toLocaleString()}
                    </div>
                )}
            </div>
             {apiError && !priceData && (
                 <p className="text-sm text-destructive">{apiError}</p>
             )}
        </div>

        {apiError && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{apiError}</AlertDescription>
            </Alert>
        )}

        <Button type="submit" disabled={!priceData || isSubmitting}>
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Proceed to Payment
        </Button>
      </form>
    </Form>
  )
}
