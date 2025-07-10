"use client"

import * as React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from 'next/navigation';

import { useAuth, useRequireAuth } from '@/lib/auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';


const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  password: z.string().optional(),
}).refine(data => !data.password || data.password.length >= 6, {
    message: "Password must be at least 6 characters.",
    path: ["password"],
});


type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
    const user = useRequireAuth();
    const { updateUser } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user?.name || "",
            password: "",
        },
    });
    
    React.useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                password: ""
            });
        }
    }, [user, form]);

    if (!user) {
        return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
    }
    
    const onSubmit = (data: ProfileFormValues) => {
        const updateData: Partial<ProfileFormValues> = { name: data.name };
        if (data.password) {
            updateData.password = data.password;
        }

        const updatedUser = updateUser(user.id, updateData);

        if (updatedUser) {
            toast({
                title: "Success!",
                description: "Your profile has been updated.",
            });
            form.reset({ name: updatedUser.name, password: "" });
        } else {
             toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update profile.",
            });
        }
    };


    return (
        <div className="flex min-h-screen w-full flex-col items-center bg-muted/40 p-4">
            <div className="w-full max-w-2xl">
                 <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Manage your account settings and personal information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={user.email} disabled />
                                    <p className="text-xs text-muted-foreground">Your email address cannot be changed.</p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your name" {...field} />
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
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Leave blank to keep current password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
