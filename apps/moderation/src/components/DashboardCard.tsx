import type { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  iconBgClass: string
  iconTextClass: string
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  iconBgClass,
  iconTextClass,
}: DashboardCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconBgClass} ${iconTextClass}`}
      >
        <Icon size={20} />
      </div>
      <div>
        <div className="text-2xl font-bold tabular-nums text-primary">
          {value}
        </div>
        <div className="text-xs font-medium uppercase tracking-wider text-muted">
          {title}
        </div>
      </div>
    </div>
  )
}
