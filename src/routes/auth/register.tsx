import ParaglideLocaleSwitcher from '#/components/LocaleSwitcher'
import BrandLogo from '#/components/BrandLogo'
import ThemeToggle from '#/components/ThemeToggle'
import { Button } from '#/components/ui/button'
import { FloatingInput, FloatingLabel } from '#/components/ui/floating-label-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '#/components/ui/form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react'
import { Role } from '#/shared/constants'
import { RegisterRequestSchema, type RegisterFormValues } from '#/lib/schemas/auth'
import { useRegister } from '#/hooks/use-auth'
import { Lock, Check, Loader2 } from 'lucide-react'
import registerIllustration from '#/assets/images/register-illustration.png'
import { toast } from 'sonner'
import { ApiError, NetworkError } from '#/lib/api/client'

export const Route = createFileRoute('/auth/register')({
    component: RouteComponent,
})

// Self-registration always creates a read-only viewer account — Régional
// and National roles are provisioned by an administrator (see
// /admin/users/create).

function PasswordStrength({ password }: { password: string }) {
    const checks = [
        { label: 'Au moins 6 caractères', ok: password.length >= 6 },
        { label: 'Une majuscule', ok: /[A-Z]/.test(password) },
        { label: 'Une minuscule', ok: /[a-z]/.test(password) },
        { label: 'Un chiffre', ok: /[0-9]/.test(password) },
        { label: 'Un caractère spécial', ok: /[^a-zA-Z0-9]/.test(password) },
    ]
    const strength = checks.filter(c => c.ok).length
    const colors = ['#e5e7eb', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981']

    if (!password) return null

    return (
        <div className="mt-2 space-y-2">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                    <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: i <= strength ? colors[strength] : '#e5e7eb' }}
                    />
                ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
                {checks.map(c => (
                    <div key={c.label} className="flex items-center gap-1.5 text-xs" style={{ color: c.ok ? '#10b981' : 'var(--texte-gray)' }}>
                        <Check className="w-3 h-3" style={{ opacity: c.ok ? 1 : 0.3 }} />
                        {c.label}
                    </div>
                ))}
            </div>
        </div>
    )
}

function StepDots({ step }: { step: number }) {
    return (
        <div className="flex items-center gap-2 justify-center my-4">
            {[1, 2].map(i => (
                <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                        width: i === step ? '24px' : '8px',
                        height: '8px',
                        backgroundColor: i === step ? 'var(--primary2)' : '#d1d5db',
                    }}
                />
            ))}
        </div>
    )
}

function RouteComponent() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1);
    const registerMutation = useRegister()

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterRequestSchema),
        defaultValues: {
            username: '',
            email: '',
            full_name: '',
            organisation: '',
            region_id: undefined,
            role: Role.Viewer,
            password: '',
            confirmPassword: ''
        },
        mode: 'onChange',
    });

    const password = form.watch('password')

    const nextStep = async () => {
        const isStepValid = await form.trigger(['username', 'email', 'full_name']);
        if (isStepValid) setStep(2);
    };
    const prevStep = () => setStep(1);

    const onSubmit = (values: RegisterFormValues) => {
        const { confirmPassword, ...payload } = values
        registerMutation.mutate(payload, {
            onSuccess: () => {
                toast.success('Account created successfully. You can now sign in.')
                navigate({ to: '/auth/signin' })
            },
            onError: (error) => {
                const message = error instanceof NetworkError ? 'Server unreachable. Please check the backend is running.' : error instanceof ApiError ? error.message : 'Unable to create the account.'
                toast.error(message)
            },
        })
    }

    return (
        <div className='w-full min-h-screen flex flex-col' style={{ backgroundColor: 'var(--background-white-color)' }}>
            <div className='w-full flex items-center justify-end p-4 gap-1'>
                <ParaglideLocaleSwitcher />
                <ThemeToggle />
            </div>

            <div className="flex-1 flex items-stretch">
                {/* Left illustration */}
                <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative">
                    <div
                        className="absolute inset-6 rounded-3xl"
                        style={{ backgroundColor: '#EFF6FF' }}
                    />
                    <div className="relative z-10 text-center mb-8">
                        <h1
                            className="text-4xl xl:text-5xl font-bold leading-tight"
                            style={{ color: 'var(--primary)' }}
                        >
                            Priorité au <span style={{ color: 'var(--primary2)' }}>soin</span>,
                            <br />
                            contrôle <span style={{ color: 'var(--primary2)', opacity: 0.6 }}>simplifié</span>.
                        </h1>
                    </div>
                    <div className="relative z-10 w-full max-w-md">
                        <img
                            src={registerIllustration}
                            alt="Illustration inscription"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>

                {/* Right form */}
                <div className='w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12'>
                    <div className='w-full max-w-md'>
                        <div className='mb-6 text-center'>
                            <BrandLogo className="h-8 w-auto mx-auto mb-5" />
                            <h2
                                className="text-3xl font-bold tracking-tight mb-2"
                                style={{ color: 'var(--texte-extra-black)' }}
                            >
                                Créer un Compte
                            </h2>
                            <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>
                                Veuillez saisir vos informations dans les champs ci-dessous pour accéder à votre compte.
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                                {step === 1 && (
                                    <div className='space-y-4'>
                                        <FormField
                                            control={form.control}
                                            name='full_name'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className='relative'>
                                                        <FormControl>
                                                            <FloatingInput
                                                                {...field}
                                                                id="floating-fullname"
                                                                className="h-14 rounded-xl border-gray-200"
                                                            />
                                                        </FormControl>
                                                        <FloatingLabel htmlFor="floating-fullname">Nom et Prénom</FloatingLabel>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='username'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className='relative'>
                                                        <FormControl>
                                                            <FloatingInput
                                                                {...field}
                                                                id="floating-username"
                                                                autoComplete="username"
                                                                className="h-14 rounded-xl border-gray-200"
                                                            />
                                                        </FormControl>
                                                        <FloatingLabel htmlFor="floating-username">Username</FloatingLabel>
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
                                                            <FloatingInput
                                                                {...field}
                                                                id="floating-email"
                                                                type="email"
                                                                className="h-14 rounded-xl border-gray-200"
                                                            />
                                                        </FormControl>
                                                        <FloatingLabel htmlFor="floating-email">Email</FloatingLabel>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='organisation'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className='relative'>
                                                        <FormControl>
                                                            <FloatingInput
                                                                {...field}
                                                                id="floating-organisation"
                                                                className="h-14 rounded-xl border-gray-200"
                                                            />
                                                        </FormControl>
                                                        <FloatingLabel htmlFor="floating-organisation">Organisation (optionnel)</FloatingLabel>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className='space-y-4'>
                                        <div
                                            className="rounded-xl p-3 text-xs"
                                            style={{ backgroundColor: 'var(--background-gray-color)', color: 'var(--texte-gray)' }}
                                        >
                                            Accounts created here are read-only (rôle « Lecture seule »).
                                            Regional and National roles are assigned by an administrator.
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name='password'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className='relative'>
                                                        <FormControl>
                                                            <FloatingInput
                                                                {...field}
                                                                id="floating-password"
                                                                type='password'
                                                                className="h-14 rounded-xl border-gray-200 pr-10"
                                                            />
                                                        </FormControl>
                                                        <FloatingLabel htmlFor="floating-password">Password</FloatingLabel>
                                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <PasswordStrength password={password} />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='confirmPassword'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className='relative'>
                                                        <FormControl>
                                                            <FloatingInput
                                                                {...field}
                                                                id="floating-confirm-password"
                                                                type='password'
                                                                className="h-14 rounded-xl border-gray-200 pr-10"
                                                            />
                                                        </FormControl>
                                                        <FloatingLabel htmlFor="floating-confirm-password">Confirm password</FloatingLabel>
                                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                <StepDots step={step} />

                                {step === 1 ? (
                                    <Button
                                        className='w-full h-12 rounded-xl text-base font-semibold text-white'
                                        style={{
                                            background: 'linear-gradient(135deg, #023047 0%, #206ebb 100%)', color: '#ffffff',
                                            color: 'white',
                                            border: 'none'
                                        }}
                                        type='button'
                                        onClick={nextStep}>
                                        Next
                                    </Button>
                                ) : (
                                    <div className="flex gap-3">
                                        <Button
                                            className='flex-1 h-12 rounded-xl text-base font-semibold text-white'
                                            variant='outline'
                                            type='button'
                                            onClick={prevStep}>
                                            Back
                                        </Button>
                                        <Button
                                            className='flex-1 h-12 rounded-xl text-base font-semibold text-white'
                                            style={{
                                                background: 'linear-gradient(135deg, #023047 0%, #206ebb 100%)', color: '#ffffff',
                                                color: 'white',
                                                border: 'none'
                                            }}
                                            type='submit'
                                            disabled={registerMutation.isPending}>
                                            {registerMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                            Créer
                                        </Button>
                                    </div>
                                )}

                                <p className="text-center text-sm" style={{ color: 'var(--texte-gray)' }}>
                                    Vous avez déjà un compte ?{' '}
                                    <Link
                                        to='/auth/signin'
                                        className="font-semibold"
                                        style={{ color: 'var(--primary)' }}
                                    >
                                        cliquez ici.
                                    </Link>
                                </p>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
