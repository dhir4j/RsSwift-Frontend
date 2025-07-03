"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function AdminLoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("https://www.server.shedloadoverseas.com/api/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "An error occurred")
            }

            if (!data.user.isAdmin) {
                throw new Error("You do not have administrative privileges.")
            }

            login(data.user)
            toast({ title: "Admin Login Successful", description: "Welcome back!" })
            router.push('/admin/dashboard')

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-muted/40">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Admin Login</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the admin panel.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="admin@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
                        </div>
                        {error && (
                             <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Login Failed</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Login
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Not an admin?{" "}
                        <Link href="/login" className="underline">
                            User Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
