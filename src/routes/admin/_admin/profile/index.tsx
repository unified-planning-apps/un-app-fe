import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Shield, MapPin, Building2, Lock, Loader2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '#/components/ui/form'
import { FloatingInput, FloatingLabel } from '#/components/ui/floating-label-input'
import { Button } from '#/components/ui/button'
import { useAuthStore } from '#/stores/auth-store'
import { useChangePassword } from '#/hooks/use-auth'
import { ChangePasswordFormSchema, type ChangePasswordFormValues } from '#/lib/schemas/auth'
import { ROLE_LABELS } from '#/shared/constants'
import { getRegionName } from '#/lib/regions'
import { ApiError } from '#/lib/api/client'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/_admin/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = useAuthStore((s) => s.user)
  const changePassword = useChangePassword()

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: { old_password: '', new_password: '', confirm_password: '' },
  })

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword.mutate(
      { old_password: values.old_password, new_password: values.new_password },
      {
        onSuccess: () => {
          toast.success('Mot de passe mis à jour avec succès.')
          form.reset()
        },
        onError: (error) => {
          const message = error instanceof ApiError ? error.message : 'Impossible de changer le mot de passe.'
          toast.error(message)
        },
      },
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--texte-extra-black)', fontFamily: 'Fraunces, serif' }}>
          Mon profil
        </h1>
        <p className="text-sm" style={{ color: 'var(--texte-gray)' }}>
          Informations de votre compte et sécurité
        </p>
      </div>

      {/* Account info */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ backgroundColor: 'var(--primary2)' }}
          >
            {(user?.full_name ?? user?.username ?? '?').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
              {user?.full_name || user?.username}
            </p>
            <p className="text-xs" style={{ color: 'var(--texte-gray)' }}>@{user?.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2" style={{ color: 'var(--texte-gray)' }}>
            <Mail size={15} /> {user?.email}
          </div>
          <div className="flex items-center gap-2" style={{ color: 'var(--texte-gray)' }}>
            <Shield size={15} /> {user ? ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] ?? user.role : ''}
          </div>
          {user?.organisation && (
            <div className="flex items-center gap-2" style={{ color: 'var(--texte-gray)' }}>
              <Building2 size={15} /> {user.organisation}
            </div>
          )}
          {user?.region_id && (
            <div className="flex items-center gap-2" style={{ color: 'var(--texte-gray)' }}>
              <MapPin size={15} /> {getRegionName(user.region_id)}
            </div>
          )}
        </div>
      </div>

      {/* Change password */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold text-base" style={{ color: 'var(--texte-extra-black)' }}>
            Changer le mot de passe
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput {...field} id="old-password" type="password" className="h-14 rounded-xl border-gray-200" />
                    </FormControl>
                    <FloatingLabel htmlFor="old-password">Mot de passe actuel</FloatingLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput {...field} id="new-password" type="password" className="h-14 rounded-xl border-gray-200" />
                    </FormControl>
                    <FloatingLabel htmlFor="new-password">Nouveau mot de passe</FloatingLabel>
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
                      <FloatingInput {...field} id="confirm-password" type="password" className="h-14 rounded-xl border-gray-200" />
                    </FormControl>
                    <FloatingLabel htmlFor="confirm-password">Confirmer le nouveau mot de passe</FloatingLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={changePassword.isPending}
              className="h-12 rounded-xl text-sm font-semibold px-6 text-white"
              style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary2) 100%)', color: 'white', border: 'none' }}
            >
              {changePassword.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
              Mettre à jour le mot de passe
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
