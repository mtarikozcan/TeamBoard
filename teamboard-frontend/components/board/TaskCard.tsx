import type { Task } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatDate, getInitials } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-surface-elevated border border-border rounded-lg p-3 hover:border-[#3a3a3a] transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-tx-primary leading-snug flex-1">{task.title}</p>
        <Badge status={task.priority} />
      </div>

      <div className="flex items-center gap-2 mt-2">
        {task.assigned_to_name ? (
          <>
            <div
              className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 text-[10px] flex items-center justify-center flex-shrink-0"
              title={task.assigned_to_name}
            >
              {getInitials(task.assigned_to_name)}
            </div>
            {task.due_date && (
              <span className="text-xs text-tx-muted">{formatDate(task.due_date)}</span>
            )}
          </>
        ) : (
          <span className="text-xs text-tx-muted italic">Atanmamış</span>
        )}
      </div>
    </div>
  )
}
