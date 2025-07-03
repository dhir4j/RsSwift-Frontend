"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function PaymentPage() {
  const [utr, setUtr] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (utr.length !== 12) {
      toast({
        title: "Invalid UTR",
        description: "Please enter a valid 12-digit UTR code.",
        variant: "destructive",
      })
      return
    }
    setIsSubmitted(true)
    setTimeout(() => {
        toast({
            title: "Shipment Confirmed!",
            description: "Your payment has been verified and your shipment is booked.",
        })
        router.push("/dashboard/my-shipments")
    }, 3000)
  }

  return (
    <div className="flex justify-center items-center py-12 bg-muted/40 min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>Scan the QR code to pay and then enter your UTR code below.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <Image
            src="https://placehold.co/300x300.png"
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
                onChange={(e) => setUtr(e.target.value)}
                maxLength={12}
                required
                disabled={isSubmitted}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitted}>
              {isSubmitted && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitted ? "Verifying..." : "Submit UTR Code"}
            </Button>
          </form>
        </CardContent>
         {isSubmitted && (
            <CardFooter>
                 <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Payment Submitted!</AlertTitle>
                    <AlertDescription>
                        Your payment is being verified. Please wait...
                    </AlertDescription>
                </Alert>
            </CardFooter>
        )}
      </Card>
    </div>
  )
}
