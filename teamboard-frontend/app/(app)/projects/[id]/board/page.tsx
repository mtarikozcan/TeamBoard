'use client'

import { use, useCallback, useEffect, useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Column } from '@/components/board/Column'
import { TaskModal } from '@/components/board/TaskModal'
import { CreateTaskModal } from '@/components/board/CreateTaskModal'
import { projectsApi, tasksApi } from '@/lib/api'
import type { BoardData, Project, Task, TaskStatus } from '@/types'

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params)

  const [project, setProject] = useState<Project | null>(null)
  const [board, setBoard] = useState<BoardData>({ todo: [], inprogress: [], done: [] })
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [createStatus, setCreateStatus] = useState<TaskStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectsApi.get(projectId),
        tasksApi.list(projectId),
      ])
      setProject(projectRes.data.project)
      setBoard(tasksRes.data.tasks)
    } catch (error) {
      console.error('Veri yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    loadData()
  }, [loadData])

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceStatus = source.droppableId as TaskStatus
    const destStatus = destination.droppableId as TaskStatus

    const prevBoard = { ...board }

    setBoard((prev) => {
      const newBoard = {
        todo: [...prev.todo],
        inprogress: [...prev.inprogress],
        done: [...prev.done],
      }

      const taskIndex = newBoard[sourceStatus].findIndex((t) => t.id === draggableId)
      if (taskIndex === -1) return prev

      const [movedTask] = newBoard[sourceStatus].splice(taskIndex, 1)
      const updatedTask = { ...movedTask, status: destStatus }
      newBoard[destStatus].splice(destination.index, 0, updatedTask)

      return newBoard
    })

    tasksApi.update(draggableId, { status: destStatus }).catch((error) => {
      console.error('Görev güncellenemedi, değişiklik geri alındı:', error)
      setBoard(prevBoard)
    })
  }

  function handleTaskClick(task: Task) {
    setSelectedTask(task)
  }

  function handleTaskUpdate() {
    loadData()
    setSelectedTask(null)
  }

  function handleTaskDelete() {
    setSelectedTask(null)
    loadData()
  }

  function handleTaskCreated(newTask: Task) {
    setBoard((prev) => ({
      ...prev,
      [newTask.status]: [...prev[newTask.status], newTask],
    }))
    setCreateStatus(null)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-subtle animate-pulse rounded-lg h-64" />
        ))}
      </div>
    )
  }

  const columns: TaskStatus[] = ['todo', 'inprogress', 'done']
  const members = project?.members ?? []

  return (
    <>
      {project && (
        <div className="mb-4">
          <h2 className="text-base font-semibold text-tx-primary">{project.name}</h2>
          {project.description && (
            <p className="text-sm text-tx-muted mt-0.5">{project.description}</p>
          )}
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {columns.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={board[status]}
              onTaskClick={handleTaskClick}
              onAddTask={(s) => setCreateStatus(s)}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        task={selectedTask}
        projectId={projectId}
        members={members}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />

      <CreateTaskModal
        projectId={projectId}
        status={createStatus ?? 'todo'}
        members={members}
        isOpen={!!createStatus}
        onClose={() => setCreateStatus(null)}
        onCreated={handleTaskCreated}
      />
    </>
  )
}
