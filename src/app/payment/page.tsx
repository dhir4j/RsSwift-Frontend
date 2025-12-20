"use client"

import { Suspense, useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

function PaymentComponent() {
  const [utr, setUtr] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const shipmentId = searchParams.get('shipmentId')
  const amount = searchParams.get('amount')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!shipmentId || !amount) {
        setError("Missing shipment information. Please go back and try again.")
        return
    }

    if (utr.length !== 12 || !/^\d+$/.test(utr)) {
      toast({
        title: "Invalid UTR",
        description: "Please enter a valid 12-digit UTR code.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
        const response = await fetch("https://www.server.shedloadoverseas.com/api/payments", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                shipment_id_str: shipmentId,
                utr,
                amount: parseFloat(amount)
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || "An error occurred during submission.")
        }
        
        setIsSubmitted(true)
        toast({
            title: "Payment Submitted!",
            description: "Your payment is under review. You will be notified once it's verified.",
        })
        router.push("/dashboard/my-shipments")

    } catch (err: any) {
        setError(err.message)
    } finally {
        setIsLoading(false)
    }
  }

  if (!shipmentId || !amount) {
      return (
          <div className="flex justify-center items-center py-12 bg-muted/40 min-h-[80vh]">
              <Card className="w-full max-w-md">
                 <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Invalid Payment Link</AlertTitle>
                        <AlertDescription>
                            Shipment ID or amount is missing. Please return to the booking page and try again.
                        </AlertDescription>
                    </Alert>
                </CardContent>
              </Card>
          </div>
      )
  }

  if (isSubmitted) {
      return (
        <div className="flex justify-center items-center py-12 bg-muted/40 min-h-[80vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Thank You!</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Payment Details Received!</AlertTitle>
                        <AlertDescription>
                            Your payment for shipment <strong>{shipmentId}</strong> is being verified. You can check the status on your "My Shipments" page. You will be redirected shortly.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
      )
  }

  return (
    <div className="flex justify-center items-center py-12 bg-muted/40 min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            Scan the QR to pay <strong>₹{parseFloat(amount).toLocaleString()}</strong> for shipment <strong>{shipmentId}</strong>, then enter the UTR code below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <Image
            src="/images/new_qr.png"
            alt="QR Code for payment"
            width={300}
            height={300}
            data-ai-hint="qr code"
            className="rounded-lg"
          />
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="utr">12-Digit UTR Code</Label>
              <Input
                id="utr"
                placeholder="Enter your UTR code"
                value={utr}
                onChange={(e) => setUtr(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={12}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Submission Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Submitting..." : "Submit UTR Code"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentComponent />
        </Suspense>
    )
}
