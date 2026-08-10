import ParaglideLocaleSwitcher from '#/components/LocaleSwitcher'
import ThemeToggle from '#/components/ThemeToggle'
import { Button } from '#/components/ui/button'
import { FloatingInput, FloatingLabel } from '#/components/ui/floating-label-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '#/components/ui/form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginRequestSchema, type LoginRequest } from '#/lib/schemas/auth'
import { useLogin } from '#/hooks/use-auth'
import { Lock, Loader2 } from 'lucide-react'
import signinIllustration from '#/assets/images/signin-illustration.png'
import { toast } from 'sonner'
import { ApiError, NetworkError } from '#/lib/api/client'
import BrandLogo from '#/components/BrandLogo'

export const Route = createFileRoute('/auth/signin')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const login = useLogin()

    const form = useForm<LoginRequest>({
        resolver: zodResolver(LoginRequestSchema),
        defaultValues: { username: '', password: '' }
    });

    const onSubmit = (values: LoginRequest) => {
        login.mutate(values, {
            onSuccess: () => {
                toast.success('Signed in successfully.')
                navigate({ to: '/admin/dashboard' })
            },
            onError: (error) => {
                let message = 'Incorrect credentials.'
                if (error instanceof NetworkError) {
                    message = 'Server unreachable. Please check the backend is running.'
                } else if (error instanceof ApiError) {
                    message = error.message
                }
                toast.error(message)
            },
        })
    }

    return (
        <div className='w-full min-h-screen flex flex-col' style={{ backgroundColor: 'var(--background-white-color)' }}>
            {/* Top bar */}
            <div className='w-full flex items-center justify-end p-4 gap-1'>
                <ParaglideLocaleSwitcher />
                <ThemeToggle />
            </div>

            {/* Main content */}
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
                            src={signinIllustration}
                            alt="Illustration"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>

                {/* Right form */}
                <div className='w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12'>
                    <div className='w-full max-w-md'>
                        <div className='mb-8 text-center'>
                            <BrandLogo className="h-8 w-auto mx-auto mb-6" />
                            <h2
                                className="text-3xl font-bold tracking-tight mb-2"
                                style={{ color: 'var(--texte-extra-black)' }}
                            >
                                Welcome back!
                            </h2>
                            <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>
                                Veuillez saisir vos informations dans les champs ci-dessous pour accéder à votre compte.
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                                                        type="text"
                                                        autoComplete="username"
                                                        className="h-14 rounded-xl border-gray-200 bg-white focus:border-[var(--primary2)]"
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
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='relative'>
                                                <FormControl>
                                                    <FloatingInput
                                                        {...field}
                                                        id="floating-password"
                                                        type='password'
                                                        className="h-14 rounded-xl border-gray-200 pr-10 focus:border-[var(--primary2)]"
                                                    />
                                                </FormControl>
                                                <FloatingLabel htmlFor="floating-password">Password</FloatingLabel>
                                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex items-center justify-end">
                                    <Link
                                        to='/auth/forgot-password'
                                        className="text-sm font-semibold"
                                        style={{ color: 'var(--texte-extra-black)' }}
                                    >
                                        Password oublié ?
                                    </Link>
                                </div>

                                <Button
                                    className='w-full h-12 rounded-xl text-base font-semibold text-white'
                                    style={{
                                        background: 'linear-gradient(135deg, #023047 0%, #206ebb 100%)', color: '#ffffff',
                                        color: 'white',
                                        border: 'none'
                                    }}
                                    type='submit'
                                    disabled={login.isPending}
                                >
                                    {login.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                    Sign in
                                </Button>

                                <p className="text-center text-sm" style={{ color: 'var(--texte-gray)' }}>
                                    Besoin d'un compte ?{' '}
                                    <Link
                                        to='/auth/register'
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
