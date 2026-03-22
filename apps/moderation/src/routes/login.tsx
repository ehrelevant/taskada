import { API_URL } from '#/lib/env'
import { authClient, signIn, signOut, useSession } from '#/lib/auth-client'
import { checkAdminRole } from '@repo/shared/api/moderation'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ShieldAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

interface LoginFormValues {
  email: string
  password: string
}

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  })

  if (isPending) {
    return null
  }

  if (session) {
    router.navigate({ to: '/' })
    return null
  }

  const onSubmit = async (values: LoginFormValues) => {
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await signIn.email({
        email: values.email,
        password: values.password,
      })

      if (result.error) {
        setError(result.error.message ?? 'Invalid email or password.')
        setIsSubmitting(false)
        return
      }

      const isAdmin = await checkAdminRole(authClient as never, API_URL)

      if (!isAdmin) {
        await signOut()
        setError('Access denied. Admin role required.')
        setIsSubmitting(false)
        return
      }

      router.navigate({ to: '/' })
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="border-border bg-surface rounded-xl border p-8">
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="bg-accent-subtle flex h-12 w-12 items-center justify-center rounded-xl">
              <ShieldAlert size={24} className="text-accent" />
            </div>
            <h1 className="text-primary text-lg font-bold">Taskada Moderation Panel</h1>
            <p className="text-muted text-sm">Sign in with your admin account</p>
          </div>

          {error && (
            <div className="border-danger/20 bg-danger-subtle text-danger mb-4 rounded-lg border px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="text-secondary mb-1.5 block text-xs font-medium">Email</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address.',
                  },
                })}
                placeholder="admin@example.com"
                className="border-border bg-surface-raised text-primary placeholder:text-muted focus:border-accent w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors"
              />
              {errors.email && <p className="text-danger mt-1 text-xs">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-secondary mb-1.5 block text-xs font-medium">Password</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required.',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters.',
                  },
                })}
                placeholder="••••••••"
                className="border-border bg-surface-raised text-primary placeholder:text-muted focus:border-accent w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors"
              />
              {errors.password && <p className="text-danger mt-1 text-xs">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent hover:bg-accent-hover mt-2 w-full cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
