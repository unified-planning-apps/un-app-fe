import ParaglideLocaleSwitcher from '#/components/LocaleSwitcher'
import ThemeToggle from '#/components/ThemeToggle'
import { Button } from '#/components/ui/button'
import { FloatingInput, FloatingLabel } from '#/components/ui/floating-label-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '#/components/ui/form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Lock, Loader2, ShieldAlert } from 'lucide-react'
import { useResetPassword } from '#/hooks/use-auth'
import { ResetPasswordFormSchema, type ResetPasswordFormValues } from '#/lib/schemas/auth'
import { ApiError } from '#/lib/api/client'
import { toast } from 'sonner'

export const Route = createFileRoute('/auth/reset-password')({
  // The reset token arrives via the URL: /auth/reset-password?token=...
  validateSearch: z.object({
    token: z.string().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch()
  const navigate = useNavigate()
  const resetPassword = useResetPassword()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: { new_password: '', confirm_password: '' },
  })

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!token) return
    resetPassword.mutate(
      { token, new_password: values.new_password },
      {
        onSuccess: () => {
          toast.success('Mot de passe réinitialisé. Vous pouvez vous connecter.')
          navigate({ to: '/auth/signin' })
        },
        onError: (error) => {
          const message =
            error instanceof ApiError ? error.message : 'Lien de réinitialisation invalide ou expiré.'
          toast.error(message)
        },
      },
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background-white-color)' }}>
      <div className="w-full flex items-center justify-end p-4 gap-1">
        <ParaglideLocaleSwitcher />
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {!token ? (
            <div className="text-center space-y-5">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}
              >
                <ShieldAlert size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--texte-extra-black)' }}>
                  Lien invalide
                </h2>
                <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>
                  Ce lien de réinitialisation est incomplet ou a expiré.
                  Demandez un nouveau lien depuis la page « Mot de passe oublié ».
                </p>
              </div>
              <Link
                to="/auth/forgot-password"
                className="inline-flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: 'var(--primary)' }}
              >
                Demander un nouveau lien
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h2
                  className="text-3xl font-bold tracking-tight mb-2"
                  style={{ color: 'var(--texte-extra-black)' }}
                >
                  Nouveau mot de passe
                </h2>
                <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>
                  Choisissez un nouveau mot de passe pour votre compte.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormControl>
                            <FloatingInput
                              {...field}
                              id="reset-new-password"
                              type="password"
                              autoComplete="new-password"
                              className="h-14 rounded-xl border-gray-200 pr-10 focus:border-[var(--primary2)]"
                            />
                          </FormControl>
                          <FloatingLabel htmlFor="reset-new-password">Nouveau mot de passe</FloatingLabel>
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormControl>
                            <FloatingInput
                              {...field}
                              id="reset-confirm-password"
                              type="password"
                              autoComplete="new-password"
                              className="h-14 rounded-xl border-gray-200 pr-10 focus:border-[var(--primary2)]"
                            />
                          </FormControl>
                          <FloatingLabel htmlFor="reset-confirm-password">Confirmer le mot de passe</FloatingLabel>
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={resetPassword.isPending}
                    className="w-full h-12 rounded-xl text-base font-semibold text-white"
                    style={{
                      background: 'var(--gradient-brand)',
                      border: 'none',
                    }}
                  >
                    {resetPassword.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Réinitialiser le mot de passe
                  </Button>
                </form>
              </Form>
            </>
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
