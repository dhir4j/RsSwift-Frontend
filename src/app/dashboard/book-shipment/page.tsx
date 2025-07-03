"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DomesticShipmentForm from "@/components/domestic-shipment-form"
import InternationalShipmentForm from "@/components/international-shipment-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export type ShipmentData = {
    shipment_id_str: string;
    final_total_price_with_tax: number;
    service_type: string;
}

export default function BookShipmentPage() {
    const [shipmentData, setShipmentData] = useState<ShipmentData | null>(null);

    return (
        <Tabs defaultValue="domestic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="domestic">Domestic Shipment</TabsTrigger>
                <TabsTrigger value="international">International Shipment</TabsTrigger>
            </TabsList>
            <TabsContent value="domestic">
                <Card>
                    <CardHeader>
                        <CardTitle>Domestic Shipment</CardTitle>
                        <CardDescription>Fill in the details to book a shipment within India.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DomesticShipmentForm />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="international">
                 <Card>
                    <CardHeader>
                        <CardTitle>International Shipment</CardTitle>
                        <CardDescription>Fill in the details to book an international shipment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InternationalShipmentForm />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
