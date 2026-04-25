import ParaglideLocaleSwitcher from '#/components/LocaleSwitcher'
import ThemeToggle from '#/components/ThemeToggle'
import { Button } from '#/components/ui/button'
import { FloatingInput, FloatingLabel } from '#/components/ui/floating-label-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '#/components/ui/form'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

export const Route = createFileRoute('/auth/signin')({
    component: RouteComponent,
})

const formSchema = z.object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address."),
    password: z.string().min(6, { message: 'Invalid password.', })
});

type FormValues = z.infer<typeof formSchema>;

function RouteComponent() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = () => {

    }
    return (
        <div className='w-full h-screen'>
            <div className='w-full flex items-center justify-end'>
                <ParaglideLocaleSwitcher />
                <ThemeToggle />
            </div>
            <div className="w-full flex items-center justify-between">
                <div className="w-full">
                    Illustration
                </div>
                <div className='w-full flex flex-col items-center justify-center gap-4'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='w-full max-w-md'>
                            <div className='space-y-4'>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='relative'>
                                                <FormControl>
                                                    <FloatingInput {...field} id="floating-email" />
                                                </FormControl>
                                                <FloatingLabel htmlFor="floating-email">Email</FloatingLabel>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='relative'>
                                                <FormControl>
                                                    <FloatingInput {...field} id="floating-password" type='password' />
                                                </FormControl>
                                                <FloatingLabel htmlFor="floating-password">Password</FloatingLabel>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    className='w-full'
                                    type='submit'>
                                    Sign in
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
