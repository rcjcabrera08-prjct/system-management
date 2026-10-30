import { useState } from 'react'
import {
  AlertTriangle,
  RefreshCw,
  Rocket,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { LOGS, UNRESOLVED_COUNT, type LogCategory } from '../data/logs'
import { SYSTEMS } from '../data/systems'
import { Crosshair } from './Crosshair'

type LogFilter = 'all' | LogCategory

const FILTERS: { key: LogFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'incident', label: 'Incidents' },
  { key: 'deployment', label: 'Deployments' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'recovery', label: 'Recovery' },
]

const SEVERITY_META = {
  critical: {
    label: 'Critical',
    iconClass: 'border-rose-200 bg-rose-50 text-rose-600',
    badge: 'border-rose-200 bg-rose-100 text-rose-800',
  },
  warning: {
    label: 'Warning',
    iconClass: 'border-amber-200 bg-amber-50 text-amber-600',
    badge: 'border-amber-200 bg-amber-100 text-amber-800',
  },
  info: {
    label: 'Info',
    iconClass: 'border-blue-200 bg-blue-50 text-blue-600',
    badge: 'border-blue-200 bg-blue-100 text-blue-800',
  },
  success: {
    label: 'Success',
    iconClass: 'border-emerald-200 bg-emerald-50 text-emerald-600',
    badge: 'border-emerald-200 bg-emerald-100 text-emerald-800',
  },
} as const

const CATEGORY_ICON: Record<LogCategory, LucideIcon> = {
  incident: AlertTriangle,
  deployment: Rocket,
  maintenance: Wrench,
  recovery: RefreshCw,
}

const SYSTEM_NAMES = new Map(SYSTEMS.map((system) => [system.id, system.title]))

export function LogsPage() {
  const [filter, setFilter] = useState<LogFilter>('all')
  const filtered = filter === 'all' ? LOGS : LOGS.filter((log) => log.category === filter)

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Activity log</h1>
          <p className="mt-1 text-sm text-slate-500">
            {LOGS.length} events · {UNRESOLVED_COUNT} unresolved
          </p>
        </div>

        <div className="flex flex-wrap items-center rounded-lg border border-slate-200 bg-white p-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === key ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <Crosshair className="absolute left-1.5 top-1.5 text-xs" />
        <Crosshair className="absolute right-1.5 top-1.5 text-xs" />

        <ol className="divide-y divide-slate-100">
          {filtered.map((log, index) => {
            const severity = SEVERITY_META[log.severity]
            const Icon = CATEGORY_ICON[log.category]
            const isLast = index === filtered.length - 1

            return (
              <li key={log.id} className="flex gap-4 px-5 py-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${severity.iconClass}`}
                  >
                    <Icon size={15} strokeWidth={2} />
                  </span>
                  {!isLast && <span className="mt-2 w-px flex-1 bg-slate-100" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{log.title}</h3>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${severity.badge}`}
                    >
                      {severity.label}
                    </span>
                  </div>

                  <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{log.detail}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-600">
                      {SYSTEM_NAMES.get(log.systemId) ?? log.systemId}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{log.time}</span>
                    <span aria-hidden>·</span>
                    <span className="capitalize">{log.category}</span>
                  </div>
                </div>

                <span
                  className={`h-fit shrink-0 self-start rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                    log.resolved
                      ? 'border-slate-200 bg-slate-50 text-slate-500'
                      : 'border-rose-200 bg-rose-50 text-rose-700'
                  }`}
                >
                  {log.resolved ? 'Resolved' : 'Unresolved'}
                </span>
              </li>
            )
          })}
        </ol>

        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-500">No events match this filter.</div>
        )}
      </section>
    </>
  )
}
