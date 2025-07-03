"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Clock, Package, Truck, AlertCircle, Loader2 } from "lucide-react"

interface TrackingEvent {
    stage: string;
    date: string;
    location: string;
    activity: string;
}

interface ShipmentDetails {
    shipment_id_str: string;
    status: string;
    sender_address_city: string;
    receiver_address_city: string;
    tracking_history: TrackingEvent[];
}


export default function TrackShipmentPage() {
    const [trackingId, setTrackingId] = useState("")
    const [trackingInfo, setTrackingInfo] = useState<ShipmentDetails | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!trackingId) return;

        setIsLoading(true)
        setError(null)
        setTrackingInfo(null)

        try {
            const response = await fetch(`https://www.server.shedloadoverseas.com/api/shipments/${trackingId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Tracking ID not found. Please check the ID and try again.");
                }
                throw new Error("An error occurred while fetching tracking details.");
            }
            const data: ShipmentDetails = await response.json();
            setTrackingInfo(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    const getIconForStatus = (status: string, index: number) => {
        const lowerStatus = status.toLowerCase();
        if (index === 0 && lowerStatus.includes('delivered')) {
            return <CheckCircle className="h-4 w-4 text-primary-foreground" />;
        }
        if (lowerStatus.includes('out for delivery')) {
            return <Truck className="h-4 w-4 text-primary-foreground" />;
        }
         if (lowerStatus.includes('picked up') || lowerStatus.includes('booked')) {
            return <Package className="h-4 w-4 text-primary-foreground" />;
        }
        return <Clock className="h-4 w-4 text-primary-foreground" />;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Track Your Shipment</CardTitle>
                    <CardDescription>Enter your tracking ID to see the latest status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleTrack} className="flex items-start gap-4">
                        <div className="flex-1 max-w-sm">
                            <Input 
                                placeholder="Enter Tracking ID (e.g. RS123456789)" 
                                value={trackingId} 
                                onChange={(e) => setTrackingId(e.target.value)}
                            />
                            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                        </div>

                        <Button type="submit" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Track
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {isLoading && (
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-2/3" />
                        <Skeleton className="h-5 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                             <div key={i} className="flex gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-1/2" />
                                    <Skeleton className="h-4 w-1/3" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {trackingInfo && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Tracking Details for {trackingInfo.shipment_id_str}</CardTitle>
                        <CardDescription>
                            From {trackingInfo.sender_address_city} to {trackingInfo.receiver_address_city} - Current Status: <strong>{trackingInfo.status}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative pl-8">
                            {trackingInfo.tracking_history.map((item, index) => (
                                <div key={index} className="flex gap-6 pb-10">
                                    <div className="absolute -left-1.5 flex h-full items-center">
                                       <div className="z-10 h-8 w-8 rounded-full bg-primary flex items-center justify-center ring-8 ring-background">
                                         {getIconForStatus(item.stage, index)}
                                       </div>
                                       {index < trackingInfo.tracking_history.length - 1 && <div className="absolute left-1/2 top-8 h-full w-0.5 -translate-x-1/2 bg-border" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.stage}</p>
                                        <p className="text-sm">{item.activity}</p>
                                        <p className="text-sm text-muted-foreground">{item.location}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                 </Card>
            )}
        </div>
    )
}
