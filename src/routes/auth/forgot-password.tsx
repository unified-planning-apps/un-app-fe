import ParaglideLocaleSwitcher from '#/components/LocaleSwitcher'
import BrandLogo from '#/components/BrandLogo'
import ThemeToggle from '#/components/ThemeToggle'
import { Button } from '#/components/ui/button'
import { FloatingInput, FloatingLabel } from '#/components/ui/floating-label-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '#/components/ui/form'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { ArrowLeft, Mail, MailCheck, Loader2, KeyRound } from 'lucide-react'
import { useForgotPassword } from '#/hooks/use-auth'
import { NetworkError } from '#/lib/api/client'
import {
  ForgotPasswordRequestSchema,
  type ForgotPasswordRequest,
} from '#/lib/schemas/auth'
import { toast } from 'sonner'

export const Route = createFileRoute('/auth/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const forgotPassword = useForgotPassword()
  const [submitted, setSubmitted] = useState(false)
  // Dev only: the backend returns the reset token in the response when no
  // SMTP is configured (never in production). We surface it as a clickable
  // link so the flow is testable end-to-end.
  const [devResetToken, setDevResetToken] = useState<string | null>(null)

  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(ForgotPasswordRequestSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = (values: ForgotPasswordRequest) => {
    forgotPassword.mutate(values, {
      onSuccess: (res) => {
        setDevResetToken(res.reset_token ?? null)
        setSubmitted(true)
      },
      onError: () => {
        toast.error(error instanceof NetworkError ? 'Server unreachable. Please check the backend is running.' : "Unable to send the request. Please try again later.")
      },
    })
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
                <BrandLogo className="h-8 w-auto mx-auto mb-6" />
                <h2
                  className="text-3xl font-bold tracking-tight mb-2"
                  style={{ color: 'var(--texte-extra-black)' }}
                >
                  Forgot your password?
                </h2>
                <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>
                  Enter your email and we will send you a reset link.
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
                    disabled={forgotPassword.isPending}
                    className="w-full h-12 rounded-xl text-base font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #023047 0%, #206ebb 100%)', color: '#ffffff',
                      border: 'none',
                    }}
                  >
                    {forgotPassword.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Send reset link
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
                  Check your inbox
                </h2>
                <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>
                  If an account exists with this address, a reset link has just been sent.
                </p>
              </div>

              {devResetToken && (
                <div
                  className="rounded-xl p-4 text-left space-y-2"
                  style={{ backgroundColor: 'var(--background-gray-color)' }}
                >
                  <p className="text-xs font-semibold" style={{ color: 'var(--texte-extra-black)' }}>
                    Development mode — no email configured
                  </p>
                  <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>
                    The reset link is shown here in development mode only:
                  </p>
                  <Link
                    to="/auth/reset-password"
                    search={{ token: devResetToken }}
                    className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: 'var(--primary)' }}
                  >
                    <KeyRound size={13} />
                    Reset my password now
                  </Link>
                </div>
              )}
            </div>
          )}

          <Link
            to="/auth/signin"
            className="flex items-center justify-center gap-1.5 text-sm font-semibold mt-8"
            style={{ color: 'var(--primary)' }}
          >
            <ArrowLeft size={15} />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
