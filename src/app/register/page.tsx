"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function RegisterForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("https://www.server.shedloadoverseas.com/api/auth/signup", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    first_name: firstName, 
                    last_name: lastName, 
                    email, 
                    password 
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "An error occurred during registration.");
            }
            toast({
                title: "Registration Successful",
                description: "You can now log in with your credentials.",
            });
            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

  return (
     <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/40 py-12">
            <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleRegister} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="Max" required value={firstName} onChange={e => setFirstName(e.target.value)} disabled={isLoading} />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={e => setLastName(e.target.value)} disabled={isLoading} />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading}/>
                </div>
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Registration Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create an account
                </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                    Sign in
                </Link>
                </div>
            </CardContent>
            </Card>
        </main>
        <Footer />
    </div>
  )
}
