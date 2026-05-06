import ParaglideLocaleSwitcher from '#/components/LocaleSwitcher'
import ThemeToggle from '#/components/ThemeToggle'
import { Button } from '#/components/ui/button'
import { FloatingInput, FloatingLabel } from '#/components/ui/floating-label-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '#/components/ui/form'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react'
import { FloatingLabelSelect } from '#/components/ui/floating-label-select'
import { Region, Role } from '#/shared/constants'
import { SelectItem } from '#/components/ui/select'
import { PhoneInput } from '#/components/ui/phone-input'
import { RegisterFormSchema, type RegisterFormValues } from '#/lib/validations/auth'

export const Route = createFileRoute('/auth/register')({
    component: RouteComponent,
})

function RouteComponent() {
    const [step, setStep] = useState(1);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: { fullname: '', email: '', phoneNumber: '', region: Region.AlaotraMangoro, role: Role.Guest, password: '' }
    });

    const nextStep = async () => {
        const isStepValid = await form.trigger(['fullname','email', 'phoneNumber']);
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
                                                        <FloatingInput {...field} id="floating-fullname" />
                                                    </FormControl>
                                                    <FloatingLabel htmlFor="floating-fullname">Name and Firstname</FloatingLabel>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='phoneNumber'
                                        render={({ field }) => (
                                            <FormItem>
                                                <PhoneInput defaultCountry='MG' placeholder="Enter a phone number" {...field} id="floating-phone" />
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
