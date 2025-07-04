"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import Logo from '@/components/logo';

const loginSchema = z.object({
  email: z.string().email({ message: "A valid email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const [apiError, setApiError] = useState<string | null>(null);
    const router = useRouter();
    const { loginUser, user, isAuthenticated, isLoading } = useAuth();
    const { toast } = useToast();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.isAdmin) {
            router.replace('/admin/dashboard');
        }
    }, [user, isAuthenticated, isLoading, router]);

    const onSubmit = async (data: LoginFormValues) => {
        setApiError(null);
        try {
            const loggedInUser = await loginUser(data.email, data.password);
            if (loggedInUser.isAdmin) {
                toast({
                    title: "Admin Login Successful",
                    description: `Welcome back, ${loggedInUser.firstName}!`,
                });
                router.replace('/admin/dashboard');
            } else {
                setApiError("Access denied. You do not have administrative privileges.");
            }
        } catch (err: any) {
            const errorMessage = err.data?.error || err.message || "An unexpected error occurred.";
            setApiError(errorMessage);
        }
    };

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="mx-auto max-w-sm w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                        <Logo />
                    </div>
                    <CardTitle className="text-2xl font-headline">Admin Panel Login</CardTitle>
                    <CardDescription>
                        Enter your admin credentials to access the dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="admin@example.com"
                                                {...field}
                                                disabled={form.formState.isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                                disabled={form.formState.isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {apiError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Login Failed</AlertTitle>
                                    <AlertDescription>{apiError}</AlertDescription>
                                </Alert>
                            )}
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <div className="mt-4 text-center text-sm w-full">
                        Not an admin?{" "}
                        <Link href="/login" className="underline">
                            Return to User Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
