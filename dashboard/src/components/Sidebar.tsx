import { LayoutDashboard, List, Settings } from 'lucide-react'
import { UNRESOLVED_COUNT } from '../data/logs'
import { Crosshair } from './Crosshair'

export type NavKey = 'dashboard' | 'logs' | 'settings'

interface SidebarProps {
  active: NavKey
  onNavigate: (key: NavKey) => void
}

const NAV_ITEMS: { key: NavKey; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'logs', label: 'Logs', icon: List, badge: UNRESOLVED_COUNT > 0 ? String(UNRESOLVED_COUNT) : undefined },
  { key: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="relative flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <Crosshair className="absolute -right-1.5 top-4 text-sm" />
      <Crosshair className="absolute -right-1.5 bottom-4 text-sm" />

      <div className="px-4 pb-2 pt-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Overview</span>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ key, label, icon: Icon, badge }) => {
          const isActive = key === active
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-600" />
              )}
              <Icon size={17} strokeWidth={2} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
              <span className="flex-1 text-left">{label}</span>
              {badge && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto px-4 py-5">
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-500">All systems monitored</span>
        </div>
      </div>
    </aside>
  )
}
