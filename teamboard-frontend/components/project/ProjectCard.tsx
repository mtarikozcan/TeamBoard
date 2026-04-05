import type { Project } from '@/types'
import { formatDate } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-surface-elevated border border-border rounded-lg p-4 hover:border-[#3a3a3a] transition-colors cursor-pointer flex items-center justify-between"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-tx-primary truncate">{project.name}</p>
        {project.description && (
          <p className="text-xs text-tx-muted mt-0.5 truncate">{project.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-tx-secondary">
            {project.member_count} üye
          </span>
          <span className="text-xs text-tx-muted">{formatDate(project.created_at)}</span>
        </div>
      </div>
      <span className="text-tx-muted ml-3 flex-shrink-0">→</span>
    </div>
  )
}
