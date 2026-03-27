import { Flag, LayoutDashboard, LogOut, ScrollText, Users } from 'lucide-react'
import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import { signOut } from '#/lib/auth-client'

const NAV_ITEMS = [
  { to: '/' as const, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/reports' as const, label: 'Reports', icon: Flag },
  { to: '/users' as const, label: 'Users', icon: Users },
  { to: '/audit-log' as const, label: 'Audit Log', icon: ScrollText },
]

export default function Sidebar() {
  const pathname = useRouterState({ select: s => s.location.pathname })
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.navigate({ to: '/login' })
  }

  return (
    <aside className="border-border bg-surface flex w-60 shrink-0 flex-col border-r">
      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)

          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
                isActive ? 'bg-accent-subtle text-accent' : 'text-secondary hover:bg-surface-hover'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="border-border mt-auto border-t p-3">
        <button
          onClick={handleSignOut}
          className="text-secondary hover:bg-surface-hover flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
