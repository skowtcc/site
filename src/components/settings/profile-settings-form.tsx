'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '~/lib/auth/auth-client'
import { client } from '~/lib/api/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { useToast } from '~/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form'

const profileSchema = z.object({
    displayName: z
        .string()
        .max(16, 'Display name must be 16 characters or less')
        .transform((val) => val.trim()),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileSettingsForm() {
    const { data: session, isPending } = authClient.useSession()
    const user = session?.user
    const { toast } = useToast()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: '',
        },
    })

    useEffect(() => {
        if (user?.displayName) {
            form.setValue('displayName', user.displayName)
        }
    }, [user?.displayName, form])

    const onSubmit = async (values: ProfileFormValues) => {
        if (!user) {
            toast({
                title: 'Error',
                description: 'You must be logged in to update your profile',
                variant: 'destructive',
            })
            return
        }

        try {
            const response = await client.patch('/user/update-attributes', {
                body: {
                    displayName: values.displayName || undefined,
                },
            })

            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Your display name has been updated',
                })
                
                await authClient.getSession()
            } else {
                throw new Error('Failed to update display name')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            toast({
                title: 'Error',
                description: `Failed to update display name: ${errorMessage}`,
                variant: 'destructive',
            })
        }
    }

    if (isPending) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-6">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </CardContent>
            </Card>
        )
    }

    if (!user) {
        return null;
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>Manage how your name appears across the site</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 mt-4">
                            <Label htmlFor="username">Username (from Discord)</Label>
                            <Input
                                id="username"
                                value={user?.name || ''}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-sm text-muted-foreground">
                                This is your username from Discord and cannot be changed
                            </p>
                        </div>

                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter a custom display name (optional)"
                                            maxLength={50}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is how your name will appear on the site. Leave empty to use your username.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end mt-4">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
