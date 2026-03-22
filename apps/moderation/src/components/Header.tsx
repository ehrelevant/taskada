import { ShieldAlert } from 'lucide-react'

import { useSession } from '#/lib/auth-client'

export default function Header() {
  const { data: session } = useSession()
  const userName = session?.user?.name ?? 'Admin'

  return (
    <header className="border-border bg-surface z-50 flex h-14 shrink-0 items-center justify-between border-b px-6">
      <div className="flex items-center gap-3">
        <ShieldAlert size={22} className="text-accent" />
        <span className="text-primary text-sm font-semibold tracking-wide">Moderation Panel</span>
      </div>
      <div className="text-muted text-xs">{userName}</div>
    </header>
  )
}
