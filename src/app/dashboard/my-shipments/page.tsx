import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Book } from "lucide-react"
import Link from "next/link"

const shipments = [
  { id: "RS123456789", destination: "New Delhi", date: "2023-06-23", status: "In Transit", amount: "₹250.00" },
  { id: "RS987654321", destination: "Mumbai", date: "2023-06-20", status: "Delivered", amount: "₹450.00" },
  { id: "RS555666777", destination: "Chennai", date: "2023-06-18", status: "Delivered", amount: "₹320.00" },
  { id: "RS333222111", destination: "Kolkata", date: "2023-06-15", status: "Delivered", amount: "₹600.00" },
  { id: "RS444777999", destination: "Bangalore", date: "2023-06-24", status: "Out for Delivery", amount: "₹150.00" },
];

export default function MyShipmentsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>My Shipments</CardTitle>
                <CardDescription>A list of all your past and current shipments.</CardDescription>
            </div>
            <Button asChild>
                <Link href="/dashboard/book-shipment"><Book className="mr-2 h-4 w-4" />Book New Shipment</Link>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.id}</TableCell>
                    <TableCell>{shipment.destination}</TableCell>
                    <TableCell>{shipment.date}</TableCell>
                    <TableCell>
                        <Badge variant={shipment.status === 'Delivered' ? 'default' : 'outline'}>{shipment.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{shipment.amount}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
