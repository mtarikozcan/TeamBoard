'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { tasksApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { TaskStatus, ProjectMember, Task } from '@/types'

interface CreateTaskForm {
  title: string
  description: string
  priority: string
  assignedTo: string
  dueDate: string
}

interface CreateTaskModalProps {
  projectId: string
  status: TaskStatus
  members: ProjectMember[]
  isOpen: boolean
  onClose: () => void
  onCreated: (task: Task) => void
}

export function CreateTaskModal({ projectId, status, members, isOpen, onClose, onCreated }: CreateTaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskForm>()

  async function onSubmit(data: CreateTaskForm) {
    try {
      const res = await tasksApi.create(projectId, {
        title: data.title,
        description: data.description || undefined,
        priority: (data.priority || 'medium') as 'low' | 'medium' | 'high',
        assignedTo: data.assignedTo || undefined,
        dueDate: data.dueDate || undefined,
      })

      onCreated(res.data.task)
      onClose()
      reset()
    } catch (error) {
      console.error('Görev oluşturulamadı:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-base font-semibold text-tx-primary mb-4">Yeni Görev</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Görev Başlığı"
            placeholder="Örn: API entegrasyonu"
            error={errors.title?.message}
            {...register('title', { required: 'Görev başlığı zorunludur.' })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-tx-label uppercase tracking-wider font-medium">
              Açıklama
            </label>
            <textarea
              placeholder="Görev detayları..."
              rows={3}
              className={cn(
                'w-full bg-surface-elevated border border-border rounded px-3 py-2',
                'text-sm text-tx-primary placeholder:text-tx-muted',
                'focus:outline-none focus:border-blue-500 transition-colors resize-none'
              )}
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-tx-label uppercase tracking-wider font-medium">
                Öncelik
              </label>
              <select
                defaultValue="medium"
                className="w-full bg-surface-elevated border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                {...register('priority')}
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-tx-label uppercase tracking-wider font-medium">
                Atanan
              </label>
              <select
                defaultValue=""
                className="w-full bg-surface-elevated border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                {...register('assignedTo')}
              >
                <option value="">Atanmamış</option>
                {members.map((member) => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-tx-label uppercase tracking-wider font-medium">
              Son Tarih
            </label>
            <input
              type="date"
              className="w-full bg-surface-elevated border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              {...register('dueDate')}
            />
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Oluşturuluyor...' : 'Oluştur'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
