'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

interface LayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: LayoutProps) {
  const pathname = usePathname()

  const projectMatch = pathname.match(/\/projects\/([^/]+)/)
  const projectId = projectMatch?.[1]

  const titleMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/projects': 'Projeler',
  }

  let title = titleMap[pathname] || 'TeamBoard'
  let breadcrumb: string | undefined

  if (projectId) {
    title = 'Proje'
    if (pathname.includes('/board')) breadcrumb = 'Board'
    if (pathname.includes('/settings')) breadcrumb = 'Ayarlar'
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-base">
      <Sidebar projectId={projectId} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
