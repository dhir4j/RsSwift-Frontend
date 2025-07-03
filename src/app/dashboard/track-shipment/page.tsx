"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, Package, Truck } from "lucide-react"

export default function TrackShipmentPage() {
    const [trackingId, setTrackingId] = useState("")
    const [trackingInfo, setTrackingInfo] = useState<any>(null)

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault()
        const cleanTrackingId = trackingId.replace("#", "");
        if (cleanTrackingId) {
            // Mock tracking data
            setTrackingInfo({
                id: cleanTrackingId,
                status: "In Transit",
                origin: "Mumbai",
                destination: "New Delhi",
                history: [
                    { status: "Delivered", location: "New Delhi Hub", date: "2023-06-25 14:30" },
                    { status: "Out for Delivery", location: "New Delhi Hub", date: "2023-06-25 09:00" },
                    { status: "In Transit", location: "Jaipur Hub", date: "2023-06-24 18:45" },
                    { status: "Package picked up", location: "Mumbai Hub", date: "2023-06-23 12:00" },
                ]
            })
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Track Your Shipment</CardTitle>
                    <CardDescription>Enter your tracking ID to see the latest status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleTrack} className="flex gap-4">
                        <Input 
                            placeholder="Enter Tracking ID (e.g. RS123456789)" 
                            value={trackingId} 
                            onChange={(e) => setTrackingId(e.target.value)} 
                            className="max-w-sm"
                        />
                        <Button type="submit">Track</Button>
                    </form>
                </CardContent>
            </Card>

            {trackingInfo && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Tracking Details for {trackingInfo.id}</CardTitle>
                        <CardDescription>From {trackingInfo.origin} to {trackingInfo.destination}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative pl-6">
                            {trackingInfo.history.map((item: any, index: number) => (
                                <div key={index} className="flex gap-6 pb-8">
                                    <div className="absolute left-0 top-0 flex flex-col items-center">
                                       <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center ring-4 ring-background">
                                         {index === 0 ? <CheckCircle className="h-4 w-4 text-primary-foreground" /> : <Package className="h-4 w-4 text-primary-foreground" />}
                                       </div>
                                       {index < trackingInfo.history.length - 1 && <div className="h-full w-0.5 bg-border mt-1" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.status}</p>
                                        <p className="text-sm text-muted-foreground">{item.location}</p>
                                        <p className="text-xs text-muted-foreground">{item.date}</p>
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
