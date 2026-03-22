import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ShieldAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { signIn, signOut, useSession } from '#/lib/auth-client'

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

      // Mock admin role check — replace with real endpoint when merging with monorepo
      const isAdmin = await mockCheckAdminRole(values.email)

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
        <div className="rounded-xl border border-border bg-surface p-8">
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-subtle">
              <ShieldAlert size={24} className="text-accent" />
            </div>
            <h1 className="text-lg font-bold text-primary">
              Taskada Moderation Panel
            </h1>
            <p className="text-sm text-muted">
              Sign in with your admin account
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-danger/20 bg-danger-subtle px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-secondary">
                Email
              </label>
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
                className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-primary outline-none transition-colors placeholder:text-muted focus:border-accent"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-danger">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-secondary">
                Password
              </label>
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
                className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-primary outline-none transition-colors placeholder:text-muted focus:border-accent"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-danger">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg bg-accent cursor-pointer px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// Mock admin role check — replace with real API call when merging with monorepo
async function mockCheckAdminRole(_email: string): Promise<boolean> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300))
  // For now, allow all authenticated users as admins
  // When merging, replace with: const res = await fetch('/users/roles'); ...
  return true
}
