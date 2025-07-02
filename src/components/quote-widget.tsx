"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowRight, CheckCircle2 } from "lucide-react"

const formSchema = z.object({
  origin: z.string().min(2, "Please enter a valid origin."),
  destination: z.string().min(2, "Please enter a valid destination."),
  weight: z.coerce.number().min(0.1, "Weight must be at least 0.1 kg."),
  length: z.coerce.number().min(1, "Length must be at least 1 cm."),
  width: z.coerce.number().min(1, "Width must be at least 1 cm."),
  height: z.coerce.number().min(1, "Height must be at least 1 cm."),
})

export default function QuoteWidget() {
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      weight: 1,
      length: 10,
      width: 10,
      height: 10,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Placeholder logic for quote estimation
    const baseRate = 50
    const weightCharge = values.weight * 20
    const dimensionCharge = (values.length * values.width * values.height) / 5000 * 15
    const cost = baseRate + weightCharge + dimensionCharge + (Math.random() * 50)
    setEstimatedCost(cost)
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Get an Instant Quote</CardTitle>
        <CardDescription>Fill in the details to get a shipping estimate.</CardDescription>
      </CardHeader>
      <CardContent>
        {estimatedCost === null ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bangalore" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Dimensions (cm)</FormLabel>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="L" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="W" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="H" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Get Estimate <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center">
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle className="font-headline">Estimate Ready!</AlertTitle>
              <AlertDescription>
                <p className="text-lg">Your estimated shipping cost is:</p>
                <p className="text-3xl font-bold text-primary my-2">
                  ₹{estimatedCost.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">This is a placeholder estimate. Actual prices may vary.</p>
              </AlertDescription>
            </Alert>
            <Button onClick={() => setEstimatedCost(null)} variant="link" className="mt-4">
              Calculate another quote
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
