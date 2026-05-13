import ParaglideLocaleSwitcher from '#/components/LocaleSwitcher'
import ThemeToggle from '#/components/ThemeToggle'
import { Button } from '#/components/ui/button'
import { FloatingInput, FloatingLabel } from '#/components/ui/floating-label-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '#/components/ui/form'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react'
import { FloatingLabelSelect } from '#/components/ui/floating-label-select'
import { Region, Role } from '#/shared/constants'
import { SelectItem } from '#/components/ui/select'
import { PhoneInput } from '#/components/ui/phone-input'
import { RegisterFormSchema, type RegisterFormValues } from '#/lib/validations/auth'
import { Lock, Check } from 'lucide-react'
import registerIllustration from '#/assets/images/register-illustration.png'

export const Route = createFileRoute('/auth/register')({
    component: RouteComponent,
})

const REGION_LABELS: Record<Region, string> = {
    [Region.AlaotraMangoro]: 'Alaotra-Mangoro',
    [Region.AmoronMania]: "Amoron'i Mania",
    [Region.Analamanga]: 'Analamanga',
    [Region.Analanjirofo]: 'Analanjirofo',
    [Region.Anosy]: 'Anosy',
    [Region.Androy]: 'Androy',
    [Region.AtsimoAndrefana]: 'Atsimo-Andrefana',
    [Region.AtsimoAtsinanana]: 'Atsimo-Atsinanana',
    [Region.Atsinanana]: 'Atsinanana',
    [Region.Betsiboka]: 'Betsiboka',
    [Region.Boeny]: 'Boeny',
    [Region.Bongolava]: 'Bongolava',
    [Region.Diana]: 'Diana',
    [Region.Fitovinany]: 'Fitovinany',
    [Region.Ihorombe]: 'Ihorombe',
    [Region.Itasy]: 'Itasy',
    [Region.MatsiatraAmbony]: 'Matsiatra Ambony',
    [Region.Melaky]: 'Melaky',
    [Region.Menabe]: 'Menabe',
    [Region.Sava]: 'Sava',
    [Region.Sofia]: 'Sofia',
    [Region.Vakinankaratra]: 'Vakinankaratra',
    [Region.Vatovavy]: 'Vatovavy',
}

const ROLE_LABELS: Record<Role, string> = {
    [Role.Agent]: 'Agent sur terrain',
    [Role.Guest]: 'Invité (lecture seule)',
}

function PasswordStrength({ password }: { password: string }) {
    const checks = [
        { label: 'Au moins 8 caractères', ok: password.length >= 8 },
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
    const [step, setStep] = useState(1);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            fullname: '',
            email: '',
            phoneNumber: '',
            region: Region.Analamanga,
            role: Role.Guest,
            password: '',
            confirmPassword: ''
        },
        mode: 'onChange',
    });

    const password = form.watch('password')

    const nextStep = async () => {
        const isStepValid = await form.trigger(['fullname', 'email', 'phoneNumber']);
        if (isStepValid) setStep(2);
    };
    const prevStep = () => setStep(1);

    const onSubmit = (_values: RegisterFormValues) => {
        // TODO: implement registration
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
                            style={{ fontFamily: 'Fraunces, serif', color: 'var(--primary)' }}
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
                            <h2
                                className="text-3xl font-bold mb-2"
                                style={{ color: 'var(--texte-extra-black)', fontFamily: 'Fraunces, serif' }}
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
                                            name='fullname'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className='relative'>
                                                        <FormControl>
                                                            <FloatingInput
                                                                {...field}
                                                                id="floating-fullname"
                                                                placeholder="John Doe"
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
                                            name='phoneNumber'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <PhoneInput
                                                        defaultCountry='MG'
                                                        placeholder="Numéro de téléphone"
                                                        {...field}
                                                        id="floating-phone"
                                                        className="h-14 rounded-xl border-gray-200"
                                                    />
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
                                                                placeholder="exemple@exemple.com"
                                                                className="h-14 rounded-xl border-gray-200"
                                                            />
                                                        </FormControl>
                                                        <FloatingLabel htmlFor="floating-email">Email</FloatingLabel>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
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
                                                            label='Région'
                                                            className='w-full h-14 rounded-xl border-gray-200'
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}>
                                                            {Object.values(Region).map((regionValue) => (
                                                                <SelectItem key={regionValue} value={regionValue}>
                                                                    {REGION_LABELS[regionValue as Region] ?? regionValue}
                                                                </SelectItem>
                                                            ))}
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
                                                            label='Rôle'
                                                            className='w-full h-14 rounded-xl border-gray-200'
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}>
                                                            {Object.values(Role).map((roleValue) => (
                                                                <SelectItem key={roleValue} value={roleValue}>
                                                                    {ROLE_LABELS[roleValue as Role] ?? roleValue}
                                                                </SelectItem>
                                                            ))}
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
                                                            <FloatingInput
                                                                {...field}
                                                                id="floating-password"
                                                                type='password'
                                                                className="h-14 rounded-xl border-gray-200 pr-10"
                                                            />
                                                        </FormControl>
                                                        <FloatingLabel htmlFor="floating-password">Mot de passe</FloatingLabel>
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
                                                        <FloatingLabel htmlFor="floating-confirm-password">Confirmer le mot de passe</FloatingLabel>
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
                                        className='w-full h-12 rounded-xl text-base font-semibold'
                                        style={{
                                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary2) 100%)',
                                            color: 'white',
                                            border: 'none'
                                        }}
                                        type='button'
                                        onClick={nextStep}>
                                        Suivant
                                    </Button>
                                ) : (
                                    <div className="flex gap-3">
                                        <Button
                                            className='flex-1 h-12 rounded-xl text-base font-semibold'
                                            variant='outline'
                                            type='button'
                                            onClick={prevStep}>
                                            Retour
                                        </Button>
                                        <Button
                                            className='flex-1 h-12 rounded-xl text-base font-semibold'
                                            style={{
                                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary2) 100%)',
                                                color: 'white',
                                                border: 'none'
                                            }}
                                            type='submit'>
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
