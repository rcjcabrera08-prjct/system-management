import { useState } from 'react'
import { AVG_UPTIME, SYSTEMS } from './data/systems'
import { Header, StatsGrid, buildStats, type FilterKey } from './components/Header'
import { Sidebar, type NavKey } from './components/Sidebar'
import { SystemCard } from './components/SystemCard'
import { Crosshair } from './components/Crosshair'
import { LogsPage } from './components/LogsPage'

const FILTER_PREDICATES: Record<FilterKey, (status: string) => boolean> = {
  all: () => true,
  operational: (status) => status === 'operational',
  issues: (status) => status === 'degraded',
}

export default function App() {
  const [nav, setNav] = useState<NavKey>('dashboard')
  const [filter, setFilter] = useState<FilterKey>('all')

  const operationalCount = SYSTEMS.filter((s) => s.status === 'operational').length
  const filtered = SYSTEMS.filter((s) => FILTER_PREDICATES[filter](s.status))
  const stats = buildStats(SYSTEMS.length, operationalCount, AVG_UPTIME)

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar active={nav} onNavigate={setNav} />

      <main className="relative min-w-0 flex-1 p-6 lg:p-8">
        <Crosshair className="absolute right-3 top-3 text-sm" />
        <Crosshair className="absolute bottom-3 left-3 text-sm" />

        {nav === 'logs' ? (
          <LogsPage />
        ) : (
          <>
            <Header
              operationalCount={operationalCount}
              totalCount={SYSTEMS.length}
              avgUptime={AVG_UPTIME}
              filter={filter}
              onFilterChange={setFilter}
            />

            <div className="flex flex-col gap-6">
              <StatsGrid stats={stats} />

              <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filtered.map((system) => (
                  <SystemCard key={system.id} system={system} />
                ))}
              </section>

              {filtered.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                  No systems match this filter.
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
