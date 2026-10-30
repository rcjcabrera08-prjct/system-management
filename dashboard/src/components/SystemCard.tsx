import { ArrowRight } from 'lucide-react'
import type { SystemConfig } from '../data/systems'
import { Crosshair } from './Crosshair'

interface SystemCardProps {
  system: SystemConfig
}

const STATUS_META = {
  operational: {
    label: 'Operational',
    dot: 'bg-emerald-500',
    badge: 'border-emerald-200 bg-emerald-100 text-emerald-800',
    bar: 'bg-emerald-500',
  },
  degraded: {
    label: 'Degraded',
    dot: 'bg-amber-500',
    badge: 'border-amber-200 bg-amber-100 text-amber-800',
    bar: 'bg-amber-500',
  },
} as const

export function SystemCard({ system }: SystemCardProps) {
  const meta = STATUS_META[system.status]

  return (
    <article className="relative flex flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <Crosshair className="absolute left-1.5 top-1.5 text-xs" />
      <Crosshair className="absolute right-1.5 top-1.5 text-xs" />
      <Crosshair className="absolute bottom-1.5 left-1.5 text-xs" />
      <Crosshair className="absolute bottom-1.5 right-1.5 text-xs" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
          <h3 className="text-sm font-semibold text-slate-900">{system.title}</h3>
        </div>
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.badge}`}>
          {meta.label}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-slate-500">{system.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {system.tech.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold uppercase tracking-[0.1em] text-slate-400">Uptime · 30D</span>
          <span className="font-semibold text-slate-700">{system.uptime}</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${meta.bar}`}
            style={{ width: system.uptime === '100%' ? '100%' : system.uptime }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
          {system.version}
        </span>
        <span>{system.updated}</span>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="group ml-auto inline-flex items-center gap-1 font-semibold text-[#4A7BB0] hover:text-[#3f6c9c]"
        >
          OPEN
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  )
}
