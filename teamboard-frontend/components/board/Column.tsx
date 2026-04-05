'use client'

import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/Button'
import { TaskCard } from './TaskCard'
import { getStatusLabel } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types'

interface ColumnProps {
  status: TaskStatus
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask: (status: TaskStatus) => void
}

export function Column({ status, tasks, onTaskClick, onAddTask }: ColumnProps) {
  return (
    <div className="bg-surface rounded-lg p-3 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-tx-label uppercase tracking-wider">
            {getStatusLabel(status)}
          </span>
          <span className="text-xs bg-surface-subtle text-tx-secondary px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddTask(status)}
          className="text-tx-muted hover:text-tx-primary p-1 text-base leading-none"
        >
          +
        </Button>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 flex-1 min-h-[120px] ${snapshot.isDraggingOver ? 'bg-surface-overlay rounded' : ''}`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.85 : 1,
                    }}
                  >
                    <TaskCard task={task} onClick={() => onTaskClick(task)} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
