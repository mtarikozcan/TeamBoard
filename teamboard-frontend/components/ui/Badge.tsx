import { cn } from '@/lib/utils'
import type { TaskPriority, TaskStatus } from '@/types'

type BadgeStatus = 'critical' | 'high' | 'warning' | 'done' | 'inprogress' | 'todo' | TaskPriority | TaskStatus

const priorityMap: Partial<Record<string, BadgeStatus>> = {
  low: 'todo',
  medium: 'warning',
  high: 'critical',
}

interface BadgeProps {
  status: BadgeStatus
  className?: string
}

export function Badge({ status, className }: BadgeProps) {
  const resolved = (priorityMap[status] ?? status) as string

  return (
    <span className={cn('badge', `badge-${resolved}`, className)} />
  )
}

// Etiket metni ile birlikte kullanan versiyon
interface BadgeLabelProps {
  status: BadgeStatus
  label: string
  className?: string
}

export function BadgeLabel({ status, label, className }: BadgeLabelProps) {
  const resolved = (priorityMap[status] ?? status) as string

  return (
    <span className={cn('badge', `badge-${resolved}`, className)}>
      {label}
    </span>
  )
}
