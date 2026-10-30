export type LogSeverity = 'critical' | 'warning' | 'info' | 'success'
export type LogCategory = 'incident' | 'deployment' | 'maintenance' | 'recovery'

export interface LogEntry {
  id: string
  systemId: string
  category: LogCategory
  severity: LogSeverity
  title: string
  detail: string
  time: string
  resolved: boolean
}

export const LOGS: LogEntry[] = [
  {
    id: 'facilitator-sync-errors',
    systemId: 'facilitator-dashboard',
    category: 'incident',
    severity: 'critical',
    title: 'Elevated error rate on sync API',
    detail: 'Error rate reached 4.2% over the last 15 minutes. Offline queue retries are failing for a subset of clients.',
    time: '25m ago',
    resolved: false,
  },
  {
    id: 'shopper-deploy',
    systemId: 'shopper',
    category: 'deployment',
    severity: 'info',
    title: 'v4.0.1 deployed to production',
    detail: 'Rolling deploy completed across all regions. Cart and catalog services are serving the new build.',
    time: '30m ago',
    resolved: true,
  },
  {
    id: 'acadtrack-backup',
    systemId: 'acadtrack',
    category: 'maintenance',
    severity: 'success',
    title: 'Nightly PostgreSQL backup verified',
    detail: 'Backup integrity check passed. Restore point retained for 30 days.',
    time: '2h ago',
    resolved: true,
  },
  {
    id: 'teacher-release',
    systemId: 'teacher-management',
    category: 'deployment',
    severity: 'info',
    title: 'v2.4.2 released',
    detail: 'Teacher workload and attendance fixes rolled out to all campuses.',
    time: '5h ago',
    resolved: true,
  },
  {
    id: 'facilitator-backlog',
    systemId: 'facilitator-dashboard',
    category: 'recovery',
    severity: 'success',
    title: 'Offline sync backlog cleared',
    detail: 'Deferred sync queue drained after the API gateway was restarted.',
    time: '9h ago',
    resolved: true,
  },
  {
    id: 'acadtrack-uptime',
    systemId: 'acadtrack',
    category: 'maintenance',
    severity: 'info',
    title: 'Uptime check passed',
    detail: '30-day availability holding at 99.98% with no failed probes.',
    time: '1d ago',
    resolved: true,
  },
  {
    id: 'shopper-tls',
    systemId: 'shopper',
    category: 'maintenance',
    severity: 'success',
    title: 'TLS certificate renewed',
    detail: 'Certificate rotated ahead of expiry. No client impact observed.',
    time: '1d ago',
    resolved: true,
  },
  {
    id: 'teacher-maintenance',
    systemId: 'teacher-management',
    category: 'maintenance',
    severity: 'success',
    title: 'Scheduled maintenance completed',
    detail: 'Database indexes rebuilt and dependency patches applied.',
    time: '2d ago',
    resolved: true,
  },
  {
    id: 'facilitator-cache',
    systemId: 'facilitator-dashboard',
    category: 'maintenance',
    severity: 'info',
    title: 'PWA cache purged after deploy',
    detail: 'Service worker cache refreshed to serve the latest shell assets.',
    time: '2d ago',
    resolved: true,
  },
]

export const UNRESOLVED_COUNT = LOGS.filter((log) => !log.resolved).length
