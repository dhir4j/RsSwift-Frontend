"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
import { ShipmentStatusIndicator } from './shipment-status-indicator';
import type { Shipment } from '@/lib/types';
import apiClient from '@/lib/api-client'; 
import { useToast } from '@/hooks/use-toast';
import { mapApiShipmentToFrontend } from '@/contexts/shipment-context';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const trackSchema = z.object({
  shipmentId: z.string().min(3, "Shipment ID is required").regex(/^RS\d{6}$/, "Invalid Shipment ID format (e.g., RS123456)"),
});

type TrackFormValues = z.infer<typeof trackSchema>;

export function TrackShipmentForm() {
  const [trackingResult, setTrackingResult] = useState<Shipment | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      shipmentId: searchParams.get('id') || '',
    },
  });

  const fetchShipmentDetails = async (shipmentId: string) => {
    if (!shipmentId) return;
    setIsLoading(true);
    setApiError(null);
    setTrackingResult(null);
    try {
      const shipmentFromApi = await apiClient<any>(`/api/shipments/${shipmentId}`);
      const mappedShipment = mapApiShipmentToFrontend(shipmentFromApi);
      setTrackingResult(mappedShipment);
    } catch (error: any) {
      const errorMessage = error?.data?.error || "Failed to track shipment.";
      setApiError(errorMessage);
      toast({
        title: "Tracking Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const shipmentIdFromUrl = searchParams.get('id');
    if (shipmentIdFromUrl && trackSchema.safeParse({shipmentId: shipmentIdFromUrl}).success) {
      form.setValue('shipmentId', shipmentIdFromUrl); 
      fetchShipmentDetails(shipmentIdFromUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); 

  const onSubmit = (data: TrackFormValues) => {
    router.push(`/dashboard/track-shipment?id=${data.shipmentId}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center gap-2">
            <Search className="h-8 w-8 text-primary" /> Track Your Shipment
          </CardTitle>
          <CardDescription>Enter your shipment ID to see its current status and history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 items-start">
              <FormField
                control={form.control}
                name="shipmentId"
                render={({ field }) => (
                  <FormItem className="flex-grow w-full sm:w-auto">
                    <FormLabel className="sr-only">Shipment ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Shipment ID (e.g., RS123456)" {...field} className="text-base py-6" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto text-lg py-3 px-6" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Track'}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
          <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Fetching shipment data...</p>
          </div>
      )}

      {apiError && !isLoading && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      {trackingResult && !isLoading && (
        <div className="mt-8 max-w-2xl mx-auto">
          <ShipmentStatusIndicator
            shipmentId={trackingResult.shipment_id_str}
            currentStatus={trackingResult.status}
            trackingHistory={trackingResult.tracking_history}
          />
        </div>
      )}
    </div>
  );
}
