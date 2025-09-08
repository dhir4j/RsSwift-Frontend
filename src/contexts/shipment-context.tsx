
"use client";

import type { Shipment, CreateShipmentResponse, AddShipmentPayload } from '@/lib/types';
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import apiClient from '@/lib/api-client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface ShipmentContextType {
  shipments: Shipment[]; 
  isLoading: boolean;
  fetchUserShipments: () => Promise<void>;
  getShipmentById: (shipment_id_str: string) => Promise<Shipment | undefined>; 
  addShipment: (shipmentData: AddShipmentPayload) => Promise<CreateShipmentResponse>;
}

export const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export const mapApiShipmentToFrontend = (apiShipment: any): Shipment => {
  if (!apiShipment) {
    console.error("mapApiShipmentToFrontend received null or undefined apiShipment");
    return {} as Shipment;
  }

  return {
    ...apiShipment,
    shipmentIdStr: apiShipment.shipment_id_str,
    senderName: apiShipment.sender_name,
    senderAddressStreet: apiShipment.sender_address_street,
    senderAddressCity: apiShipment.sender_address_city,
    senderAddressState: apiShipment.sender_address_state,
    senderAddressPincode: apiShipment.sender_address_pincode,
    senderAddressCountry: apiShipment.sender_address_country,
    senderPhone: apiShipment.sender_phone,
    receiverName: apiShipment.receiver_name,
    receiverAddressStreet: apiShipment.receiver_address_street,
    receiverAddressCity: apiShipment.receiver_address_city,
    receiverAddressState: apiShipment.receiver_address_state,
    receiverAddressPincode: apiShipment.receiver_address_pincode,
    receiverAddressCountry: apiShipment.receiver_address_country,
    receiverPhone: apiShipment.receiver_phone,
    packageWeightKg: parseFloat(apiShipment.package_weight_kg),
    packageWidthCm: parseFloat(apiShipment.package_width_cm),
    packageHeightCm: parseFloat(apiShipment.package_height_cm),
    packageLengthCm: parseFloat(apiShipment.package_length_cm),
    pickupDate: apiShipment.pickup_date,
    serviceType: apiShipment.service_type,
    bookingDate: apiShipment.booking_date,
    priceWithoutTax: parseFloat(apiShipment.price_without_tax),
    taxAmount18Percent: parseFloat(apiShipment.tax_amount_18_percent),
    totalWithTax18Percent: parseFloat(apiShipment.total_with_tax_18_percent),
    trackingHistory: apiShipment.tracking_history || [],
  };
};

export const ShipmentProvider = ({ children }: { children: ReactNode }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, logoutUser } = useAuth();
  const { toast } = useToast();

  const handleApiError = useCallback((error: any, operation: string) => {
    console.error(`API error during ${operation}:`, error);
    const errorMessage = error?.data?.error || error.message || "An unexpected error occurred.";
    if (error.status === 422) { 
        toast({
            title: "Authentication Issue",
            description: "Your session may have expired or is invalid. Please log in again.",
            variant: "destructive",
        });
        logoutUser();
    } else { 
        toast({
          title: `Error ${operation}`,
          description: errorMessage,
          variant: "destructive",
        });
    }
  }, [toast, logoutUser]);

  const fetchUserShipments = useCallback(async () => {
    if (!isAuthenticated || !user?.email) { 
      setShipments([]);
      return;
    }
    setIsLoading(true);
    try {
      const dataFromApi = await apiClient<any[]>(`/api/shipments?email=${encodeURIComponent(user.email)}`); 
      setShipments(dataFromApi.map(mapApiShipmentToFrontend));
    } catch (error: any) {
      handleApiError(error, 'fetching user shipments');
      setShipments([]); 
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, handleApiError]);


  const getShipmentById = useCallback(async (shipment_id_str: string): Promise<Shipment | undefined> => {
    if (!isAuthenticated) { 
        toast({ title: "Not Authenticated", description: "Please log in to view shipment details.", variant: "destructive" });
        return undefined;
    }
    setIsLoading(true);
    try {
      const dataFromApi = await apiClient<any>(`/api/shipments/${shipment_id_str}`);
      return mapApiShipmentToFrontend(dataFromApi);
    } catch (error: any)
{
      handleApiError(error, `fetching shipment ${shipment_id_str}`);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, handleApiError, toast]);

  const addShipment = useCallback(async (
    shipmentData: AddShipmentPayload 
  ): Promise<CreateShipmentResponse> => {
    setIsLoading(true);
    try {
      // Capitalize service_type before sending
      const payload = {
        ...shipmentData,
        service_type: shipmentData.service_type.charAt(0).toUpperCase() + shipmentData.service_type.slice(1)
      };

      const response = await apiClient<CreateShipmentResponse>('/api/shipments', {
        method: 'POST',
        body: JSON.stringify(payload), 
      });
      await fetchUserShipments(); 
      return response; 
    } catch (error: any) {
      handleApiError(error, 'adding shipment');
      throw error; 
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserShipments, handleApiError]); 

  return (
    <ShipmentContext.Provider value={{ shipments, isLoading, fetchUserShipments, getShipmentById, addShipment }}>
      {children}
    </ShipmentContext.Provider>
  );
};
