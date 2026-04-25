import ParaglideLocaleSwitcher from '#/components/LocaleSwitcher'
import ThemeToggle from '#/components/ThemeToggle'
import { Button } from '#/components/ui/button'
import { FloatingInput, FloatingLabel } from '#/components/ui/floating-label-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '#/components/ui/form'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react'
import { FloatingLabelSelect } from '#/components/ui/floating-label-select'
import { Region, Role } from '#/shared/constants'
import { SelectItem } from '#/components/ui/select'

export const Route = createFileRoute('/auth/register')({
    component: RouteComponent,
})

const formSchema = z.object({
    fullname: z.string().min(2, { message: 'Full name must be at least 2 characters.', }),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address."),
    region: z.enum(Region, { message: 'Please select a valid region.' }),
    role: z.enum(Role, { message: 'Please select a valid role.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.', })
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character.")
    });

type FormValues = z.infer<typeof formSchema>;

function RouteComponent() {
    const [step, setStep] = useState(1);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { fullname: '', email: '', region: Region.AlaotraMangoro, role: Role.Guest, password: '' }
    });

    const nextStep = async () => {
        const isStepValid = await form.trigger(['fullname', 'email']);
        if (isStepValid) {
            setStep(2);
        }
    };
    const prevStep = () => setStep(1);

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
                            {step === 1 && (
                                <div className='space-y-4'>
                                    <FormField
                                        control={form.control}
                                        name='fullname'
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className='relative'>
                                                    <FormControl>
                                                        <FloatingInput {...field} id="floating-customize" />
                                                    </FormControl>
                                                    <FloatingLabel htmlFor="floating-customize">Name and Firstname</FloatingLabel>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                    <Button
                                        className='w-full'
                                        type='button'
                                        onClick={nextStep}>
                                        Next
                                    </Button>
                                </div>
                            )}
                            {step === 2 && (
                                <div className='space-y-4'>
                                    <FormField
                                        control={form.control}
                                        name='region'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FloatingLabelSelect
                                                        id='region-select'
                                                        label='Region'
                                                        className='w-full'
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}>
                                                        {
                                                            Object.values(Region).map((regionValue) => (
                                                                <SelectItem key={regionValue} value={regionValue}>
                                                                    {regionValue}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </FloatingLabelSelect>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='role'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FloatingLabelSelect
                                                        id='role-select'
                                                        label='Role'
                                                        className='w-full'
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}>
                                                        {
                                                            Object.values(Role).map((roleValue) => (
                                                                <SelectItem key={roleValue} value={roleValue}>
                                                                    {roleValue}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </FloatingLabelSelect>
                                                </FormControl>
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
                                        Create
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
