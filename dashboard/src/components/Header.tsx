import { Activity, AlertTriangle, CheckCircle2, Layers, Plus } from 'lucide-react'

export type FilterKey = 'all' | 'operational' | 'issues'

interface HeaderProps {
  operationalCount: number
  totalCount: number
  avgUptime: string
  filter: FilterKey
  onFilterChange: (filter: FilterKey) => void
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'operational', label: 'Operational' },
  { key: 'issues', label: 'Issues' },
]

export function Header({ operationalCount, totalCount, avgUptime, filter, onFilterChange }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">All systems</h1>
        <p className="mt-1 text-sm text-slate-500">
          {operationalCount} of {totalCount} systems operational · avg {avgUptime} uptime
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === key ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-[#4A7BB0] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#3f6c9c]"
        >
          <Plus size={15} strokeWidth={2.5} />
          New system
        </button>
      </div>
    </header>
  )
}

export interface StatItem {
  label: string
  value: string
  icon: typeof Layers
}

interface StatsGridProps {
  stats: StatItem[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="relative bg-white p-4">
          <Icon size={16} strokeWidth={2} className="absolute right-4 top-4 text-slate-300" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
        </div>
      ))}
    </section>
  )
}

export function buildStats(total: number, operational: number, avgUptime: string): StatItem[] {
  return [
    { label: 'Systems', value: String(total), icon: Layers },
    { label: 'Operational', value: `${operational}/${total}`, icon: CheckCircle2 },
    { label: 'Needs attention', value: String(total - operational), icon: AlertTriangle },
    { label: 'Avg uptime', value: avgUptime, icon: Activity },
  ]
}
