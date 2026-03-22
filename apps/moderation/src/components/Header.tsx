import { ShieldAlert } from 'lucide-react'

export default function Header() {
  return (
    <header className="z-50 flex shrink-0 h-14 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-3">
        <ShieldAlert size={22} className="text-accent" />
        <span className="text-sm font-semibold tracking-wide text-primary">
          Moderation Panel
        </span>
      </div>
      <div className="text-xs text-muted">Admin</div>
    </header>
  )
}
