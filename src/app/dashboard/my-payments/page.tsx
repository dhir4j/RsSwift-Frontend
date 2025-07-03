import { Badge } from "@/components/ui/badge"
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

const payments = [
  { id: "UTR1234567890", date: "2023-06-23", amount: "₹250.00", status: "Verified", shipmentId: "#RS123456789" },
  { id: "UTR0987654321", date: "2023-06-20", amount: "₹450.00", status: "Verified", shipmentId: "#RS987654321" },
  { id: "UTR5556667770", date: "2023-06-18", amount: "₹320.00", status: "Pending", shipmentId: "#RS555666777" },
  { id: "UTR3332221110", date: "2023-06-15", amount: "₹600.00", status: "Verified", shipmentId: "#RS333222111" },
  { id: "UTR4447779990", date: "2023-06-24", amount: "₹150.00", status: "Failed", shipmentId: "#RS444777999" },
];

export default function MyPaymentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Payments</CardTitle>
        <CardDescription>A record of all your transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UTR / Transaction ID</TableHead>
              <TableHead>Shipment ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
                <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.shipmentId}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell className="text-right">
                         <Badge variant={
                            payment.status === 'Verified' ? 'default' : payment.status === 'Pending' ? 'outline' : 'destructive'
                        }>{payment.status}</Badge>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
