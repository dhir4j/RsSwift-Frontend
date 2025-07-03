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
import { Download } from "lucide-react"

const invoices = [
  { id: "INV-2023-001", date: "2023-06-01", amount: "₹1250.00", status: "Paid" },
  { id: "INV-2023-002", date: "2023-07-01", amount: "₹2300.50", status: "Paid" },
  { id: "INV-2023-003", date: "2023-08-01", amount: "₹1800.00", status: "Pending" },
  { id: "INV-2023-004", date: "2023-09-01", amount: "₹3150.75", status: "Overdue" },
];

export default function MyInvoicesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Invoices</CardTitle>
        <CardDescription>View and download your shipment invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                        <Badge variant={
                            invoice.status === 'Paid' ? 'default' : invoice.status === 'Pending' ? 'outline' : 'destructive'
                        }>{invoice.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4"/>
                            <span className="sr-only">Download</span>
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
