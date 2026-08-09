import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { z } from 'zod'
import { ShieldPlus, Copy, RefreshCw, Check, Loader2, Mail } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '#/components/ui/form'
import { FloatingInput, FloatingLabel } from '#/components/ui/floating-label-input'
import { FloatingLabelSelect } from '#/components/ui/floating-label-select'
import { SelectItem } from '#/components/ui/select'
import { Button } from '#/components/ui/button'
import { useAuthStore } from '#/stores/auth-store'
import { useRegister } from '#/hooks/use-auth'
import { REGIONS } from '#/lib/regions'
import { Role, ROLE_LABELS } from '#/shared/constants'
import { generateStrongPassword } from '#/lib/password-generator'
import { ApiError, NetworkError } from '#/lib/api/client'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/_admin/users/create')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    if (useAuthStore.getState().user?.role !== 'admin') {
      throw redirect({ to: '/admin/dashboard' })
    }
  },
  component: RouteComponent,
})

// Only admins reach this page, and only to provision elevated accounts —
// viewer accounts are self-service via /auth/register.
const PROVISIONABLE_ROLES = [Role.National, Role.Regional]

const CreateAccountSchema = z
  .object({
    username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères."),
    email: z.string().email('Adresse email invalide.'),
    full_name: z.string().optional(),
    organisation: z.string().optional(),
    role: z.enum([Role.National, Role.Regional]),
    region_id: z.string().optional(),
  })
  .refine((data) => data.role !== Role.Regional || !!data.region_id, {
    message: 'La région est requise pour un compte régional.',
    path: ['region_id'],
  })
type CreateAccountValues = z.infer<typeof CreateAccountSchema>

function PasswordBlock({ password, onRegenerate }: { password: string; onRegenerate: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="rounded-xl p-3 flex items-center gap-2"
      style={{ backgroundColor: 'var(--background-gray-color)' }}
    >
      <code className="flex-1 text-sm font-mono tracking-wide" style={{ color: 'var(--texte-extra-black)' }}>
        {password}
      </code>
      <button
        type="button"
        onClick={onRegenerate}
        title="Regénérer"
        className="p-2 rounded-lg hover:opacity-70"
        style={{ color: 'var(--texte-gray)' }}
      >
        <RefreshCw size={15} />
      </button>
      <button
        type="button"
        onClick={handleCopy}
        title="Copier"
        className="p-2 rounded-lg hover:opacity-70"
        style={{ color: copied ? '#22c55e' : 'var(--texte-gray)' }}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  )
}

function RouteComponent() {
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const [password, setPassword] = useState(() => generateStrongPassword())
  const [created, setCreated] = useState<{ username: string; email: string } | null>(null)

  const form = useForm<CreateAccountValues>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      username: '',
      email: '',
      full_name: '',
      organisation: '',
      role: Role.Regional,
      region_id: undefined,
    },
  })

  const role = form.watch('role')

  const onSubmit = (values: CreateAccountValues) => {
    registerMutation.mutate(
      { ...values, password },
      {
        onSuccess: () => {
          setCreated({ username: values.username, email: values.email })
          toast.success('Compte créé. Communiquez les identifiants en lieu sûr.')
        },
        onError: (error) => {
          const message = error instanceof NetworkError ? 'Serveur inaccessible.' : error instanceof ApiError ? error.message : 'Impossible de créer le compte.'
          toast.error(message)
        },
      },
    )
  }

  if (created) {
    return (
      <div className="max-w-lg mx-auto space-y-6 pb-10">
        <div
          className="rounded-2xl border p-6 text-center"
          style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}
          >
            <Check size={22} />
          </div>
          <h2 className="font-semibold text-lg mb-1" style={{ color: 'var(--texte-extra-black)' }}>Compte créé</h2>
          <p className="text-sm mb-5" style={{ color: 'var(--texte-gray)' }}>
            Transmettez ces identifiants à <strong>{created.username}</strong> par un canal sécurisé
            (l'utilisateur pourra se connecter immédiatement avec ce mot de passe).
          </p>

          <div className="space-y-3 text-left">
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--texte-gray)' }}>Nom d'utilisateur</p>
              <p className="text-sm font-mono" style={{ color: 'var(--texte-extra-black)' }}>{created.username}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--texte-gray)' }}>Mot de passe</p>
              <PasswordBlock password={password} onRegenerate={() => setPassword(generateStrongPassword())} />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <a
              href={`mailto:${created.email}?subject=${encodeURIComponent('Vos identifiants HealthShield')}&body=${encodeURIComponent(
                `Nom d'utilisateur : ${created.username}\nMot de passe temporaire : ${password}\n\nConnectez-vous sur la plateforme puis changez votre mot de passe dans votre profil.`,
              )}`}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #023047 0%, #206ebb 100%)', color: '#ffffff', color: 'white' }}
            >
              <Mail size={15} /> Envoyer par email
            </a>
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-xl text-sm font-semibold"
              onClick={() => navigate({ to: '/admin/users' })}
            >
              Retour à la liste
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-10">
      <div>
        <h1 className="page-title">
          Créer un compte national / régional
        </h1>
        <p className="page-subtitle">
          Les comptes avec un rôle élevé sont créés uniquement par un administrateur.
          Un mot de passe fort est généré automatiquement — communiquez-le à l'utilisateur
          par un canal externe sécurisé.
        </p>
      </div>

      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: 'var(--background-white-color)', borderColor: 'var(--stroke-dark)' }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput {...field} id="full-name" className="h-14 rounded-xl border-gray-200" />
                    </FormControl>
                    <FloatingLabel htmlFor="full-name">Nom et prénom</FloatingLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput {...field} id="create-username" autoComplete="off" className="h-14 rounded-xl border-gray-200" />
                    </FormControl>
                    <FloatingLabel htmlFor="create-username">Nom d'utilisateur</FloatingLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput {...field} id="create-email" type="email" className="h-14 rounded-xl border-gray-200" />
                    </FormControl>
                    <FloatingLabel htmlFor="create-email">Email</FloatingLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organisation"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <FloatingInput {...field} id="create-organisation" className="h-14 rounded-xl border-gray-200" />
                    </FormControl>
                    <FloatingLabel htmlFor="create-organisation">Organisation (optionnel)</FloatingLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelSelect
                      id="create-role-select"
                      label="Rôle"
                      className="w-full h-14 rounded-xl border-gray-200"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {PROVISIONABLE_ROLES.map((r) => (
                        <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                      ))}
                    </FloatingLabelSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {role === Role.Regional && (
              <FormField
                control={form.control}
                name="region_id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelSelect
                        id="create-region-select"
                        label="Région"
                        className="w-full h-14 rounded-xl border-gray-200"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {REGIONS.map((r) => (
                          <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                        ))}
                      </FloatingLabelSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div>
              <p className="text-xs mb-1.5" style={{ color: 'var(--texte-gray)' }}>Mot de passe généré automatiquement</p>
              <PasswordBlock password={password} onRegenerate={() => setPassword(generateStrongPassword())} />
            </div>

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-12 rounded-xl text-base font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #023047 0%, #206ebb 100%)', color: '#ffffff', color: 'white', border: 'none' }}
            >
              {registerMutation.isPending ? <Loader2 size={16} className="animate-spin mr-2" /> : <ShieldPlus size={16} className="mr-2" />}
              Créer le compte
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
