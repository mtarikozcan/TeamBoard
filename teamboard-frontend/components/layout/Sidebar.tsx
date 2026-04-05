'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SidebarProps {
  projectId?: string
}

interface NavItem {
  href: string
  label: string
}

export function Sidebar({ projectId }: SidebarProps) {
  const pathname = usePathname()

  const baseNav: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projeler' },
  ]

  const projectNav: NavItem[] = projectId
    ? [
        { href: `/projects/${projectId}/board`, label: 'Board' },
        { href: `/projects/${projectId}/settings`, label: 'Ayarlar' },
      ]
    : []

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/projects') return pathname === '/projects' || pathname.startsWith('/projects/')
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  function renderNavItem(item: NavItem) {
    const active = isActive(item.href)

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center px-3 py-2 rounded text-sm transition-colors mx-2',
          active
            ? 'bg-surface-overlay text-tx-primary'
            : 'text-tx-secondary hover:text-tx-primary hover:bg-surface-elevated'
        )}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <aside className="w-48 h-full bg-surface border-r border-border flex flex-col flex-shrink-0">
      <div className="px-4 py-3 text-sm font-semibold text-tx-primary border-b border-border">
        TEAMBOARD
      </div>

      <nav className="flex-1 py-4">
        {baseNav.map(renderNavItem)}

        {projectId && projectNav.length > 0 && (
          <>
            <div className="mt-4 mb-2 px-4">
              <span className="text-xs text-tx-muted font-medium uppercase tracking-wider">
                Proje
              </span>
            </div>
            {projectNav.map(renderNavItem)}
          </>
        )}
      </nav>

      <div className="px-4 pb-4 text-xs text-tx-muted">
        v1.0
      </div>
    </aside>
  )
}
