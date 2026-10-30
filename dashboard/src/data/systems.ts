export type SystemStatus = 'operational' | 'degraded'

export interface SystemConfig {
  id: string
  title: string
  description: string
  tech: string[]
  status: SystemStatus
  uptime: string
  version: string
  updated: string
}

export const SYSTEMS: SystemConfig[] = [
  {
    id: 'acadtrack',
    title: 'AcadTrack',
    description:
      'Academic tracking and record management platform built with Flask and PostgreSQL. Handles schedules, grades, and student progress across campuses.',
    tech: ['Python', 'Flask', 'PostgreSQL'],
    status: 'operational',
    uptime: '99.98%',
    version: 'v3.1.0',
    updated: '2h ago',
  },
  {
    id: 'teacher-management',
    title: 'Teacher Management Portal',
    description:
      'Portal for managing teacher assignments, workloads, and attendance. Lightweight web app optimized for quick daily administrative workflows.',
    tech: ['Flask', 'JavaScript'],
    status: 'operational',
    uptime: '99.95%',
    version: 'v2.4.2',
    updated: '5h ago',
  },
  {
    id: 'facilitator-dashboard',
    title: 'Facilitator Dashboard',
    description:
      'Progress-tracking dashboard for facilitators, delivered as an installable PWA. Available offline with deferred sync to the central service.',
    tech: ['JavaScript', 'PWA'],
    status: 'degraded',
    uptime: '98.70%',
    version: 'v1.8.0',
    updated: '1d ago',
  },
  {
    id: 'shopper',
    title: 'Shopper',
    description:
      'Catalog and cart experience for a retail storefront. Backed by Flask services with PostgreSQL persistence and a mobile-first PWA client.',
    tech: ['Flask', 'PostgreSQL', 'PWA'],
    status: 'operational',
    uptime: '100%',
    version: 'v4.0.1',
    updated: '30m ago',
  },
]

export const AVG_UPTIME = '99.66%'