import { API_URL } from '#/lib/env'
import { authClient } from '#/lib/auth-client'
import { checkAdminRole } from '@repo/shared/api/moderation'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const session = await authClient.getSession()

    if (!session.data) {
      throw redirect({ to: '/login' })
    }

    const isAdmin = await checkAdminRole(authClient as never, API_URL)
    if (!isAdmin) {
      throw redirect({ to: '/login' })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return <Outlet />
}
