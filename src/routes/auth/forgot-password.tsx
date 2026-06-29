import ParaglideLocaleSwitcher from '#/components/LocaleSwitcher'
import ThemeToggle from '#/components/ThemeToggle'
import { Button } from '#/components/ui/button'
import { FloatingInput, FloatingLabel } from '#/components/ui/floating-label-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '#/components/ui/form'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { z } from 'zod'
import { ArrowLeft, Mail, MailCheck, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/auth/forgot-password')({
  component: RouteComponent,
})

const ForgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide.'),
})
type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>

function RouteComponent() {
  const [submitted, setSubmitted] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  })

  // NOTE: the backend doesn't yet expose a password-reset endpoint
  // (e.g. POST /auth/forgot-password). This flow is built ahead of that —
  // once it exists, replace this with a real mutation. The generic
  // confirmation message is intentional: it doesn't reveal whether the
  // email matches an existing account, which is the email-verification
  // security model planned for this feature.
  const onSubmit = (_values: ForgotPasswordValues) => {
    setIsPending(true)
    setTimeout(() => {
      setIsPending(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background-white-color)' }}>
      <div className="w-full flex items-center justify-end p-4 gap-1">
        <ParaglideLocaleSwitcher />
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {!submitted ? (
            <>
              <div className="mb-8 text-center">
                <h2
                  className="text-3xl font-bold mb-2"
                  style={{ color: 'var(--texte-extra-black)', fontFamily: 'Fraunces, serif' }}
                >
                  Mot de passe oublié ?
                </h2>
                <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>
                  Indiquez votre email, nous vous envoyons un lien de réinitialisation.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormControl>
                            <FloatingInput
                              {...field}
                              id="forgot-email"
                              type="email"
                              className="h-14 rounded-xl border-gray-200 focus:border-[var(--primary2)]"
                            />
                          </FormControl>
                          <FloatingLabel htmlFor="forgot-email">Email</FloatingLabel>
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 rounded-xl text-base font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary2) 100%)',
                      border: 'none',
                    }}
                  >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Envoyer le lien
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className="text-center space-y-5">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}
              >
                <MailCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--texte-extra-black)' }}>
                  Vérifiez votre boîte mail
                </h2>
                <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>
                  Si un compte existe avec cette adresse, un lien de réinitialisation vient de lui être envoyé.
                </p>
              </div>
            </div>
          )}

          <Link
            to="/auth/signin"
            className="flex items-center justify-center gap-1.5 text-sm font-semibold mt-8"
            style={{ color: 'var(--primary)' }}
          >
            <ArrowLeft size={15} />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}
