'use client'

import { useRouter } from 'next/navigation'
import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TopbarProps {
  title: string
  breadcrumb?: string
}

export function Topbar({ title, breadcrumb }: TopbarProps) {
  const router = useRouter()

  const userName = typeof window !== 'undefined'
    ? (localStorage.getItem('teamboard_name') ?? 'Kullanıcı')
    : 'Kullanıcı'

  function handleLogout() {
    localStorage.removeItem('teamboard_token')
    localStorage.removeItem('teamboard_user_id')
    localStorage.removeItem('teamboard_name')
    localStorage.removeItem('teamboard_email')
    router.push('/login')
  }

  return (
    <header className="h-12 bg-surface border-b border-border flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-tx-primary">{title}</span>
        {breadcrumb && (
          <span className="text-tx-muted text-sm">/ {breadcrumb}</span>
        )}
      </div>

      <button
        onClick={handleLogout}
        title="Çıkış yap"
        className={cn(
          'w-7 h-7 rounded-full bg-blue-900 text-blue-300',
          'text-xs font-semibold flex items-center justify-center',
          'hover:bg-blue-800 transition-colors'
        )}
      >
        {getInitials(userName)}
      </button>
    </header>
  )
}
