'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { commentsApi, tasksApi } from '@/lib/api'
import { cn, formatDate, getInitials } from '@/lib/utils'
import type { Task, Comment, ProjectMember } from '@/types'

interface TaskModalProps {
  task: Task | null
  projectId: string
  members: ProjectMember[]
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
}

export function TaskModal({ task, projectId, members, onClose, onUpdate, onDelete }: TaskModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      loadComments()
    }
  }, [task])

  async function loadComments() {
    if (!task) return
    try {
      const res = await commentsApi.list(task.id)
      setComments(res.data.comments)
    } catch (error) {
      console.error('Yorumlar yüklenemedi:', error)
    }
  }

  async function handleUpdate(field: string, value: unknown) {
    if (!task) return
    try {
      await tasksApi.update(task.id, { [field]: value })
      onUpdate()
    } catch (error) {
      console.error('Görev güncellenemedi:', error)
    }
  }

  async function handleDelete() {
    if (!task || !confirm('Bu görevi silmek istediğinize emin misiniz?')) return
    try {
      await tasksApi.delete(task.id)
      onDelete()
    } catch (error) {
      console.error('Görev silinemedi:', error)
    }
  }

  async function handleAddComment() {
    if (!task || !newComment.trim()) return
    setLoading(true)
    try {
      await commentsApi.create(task.id, newComment.trim())
      await loadComments()
      setNewComment('')
    } catch (error) {
      console.error('Yorum eklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return
    try {
      await commentsApi.delete(commentId)
      await loadComments()
    } catch (error) {
      console.error('Yorum silinemedi:', error)
    }
  }

  if (!task) return null

  const userName = typeof window !== 'undefined'
    ? (localStorage.getItem('teamboard_name') ?? '')
    : ''

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[480px] bg-surface border-l border-border z-50 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-base font-semibold text-tx-primary flex-1 pr-4">{task.title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1 text-lg">
            ✕
          </Button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-tx-label uppercase tracking-wider font-medium">DURUM</span>
              <select
                value={task.status}
                onChange={(e) => handleUpdate('status', e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="todo">Yapılacak</option>
                <option value="inprogress">Devam Ediyor</option>
                <option value="done">Tamamlandı</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-tx-label uppercase tracking-wider font-medium">ÖNCELİK</span>
              <select
                value={task.priority}
                onChange={(e) => handleUpdate('priority', e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-tx-label uppercase tracking-wider font-medium">ATANAN</span>
              <select
                value={task.assigned_to ?? ''}
                onChange={(e) => handleUpdate('assigned_to', e.target.value || null)}
                className="w-full bg-surface-elevated border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Atanmamış</option>
                {members.map((member) => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-tx-label uppercase tracking-wider font-medium">SON TARİH</span>
              <input
                type="date"
                value={task.due_date ?? ''}
                onChange={(e) => handleUpdate('due_date', e.target.value || null)}
                className="w-full bg-surface-elevated border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-border flex-shrink-0">
          <span className="text-xs text-tx-label uppercase tracking-wider font-medium">AÇIKLAMA</span>
          <textarea
            defaultValue={task.description ?? ''}
            onBlur={(e) => {
              if (e.target.value !== (task.description ?? '')) {
                handleUpdate('description', e.target.value || null)
              }
            }}
            className="mt-2 w-full bg-surface-subtle border-none resize-none text-sm text-tx-primary p-2 rounded focus:outline-none focus:bg-surface-overlay min-h-[80px]"
            placeholder="Görev açıklaması..."
          />
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
          <span className="text-xs text-tx-label uppercase tracking-wider font-medium">YORUMLAR</span>

          {comments.length === 0 ? (
            <p className="text-tx-muted text-sm">Henüz yorum yok</p>
          ) : (
            comments.map((comment) => {
              const isOwnComment = comment.user_id === userName

              return (
                <div key={comment.id} className="flex gap-2">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0',
                      isOwnComment ? 'bg-blue-900 text-blue-300' : 'bg-surface-subtle text-tx-secondary'
                    )}
                  >
                    {getInitials(comment.user_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-tx-primary">{comment.user_name}</span>
                      <span className="text-xs text-tx-muted">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-tx-secondary mt-0.5">{comment.content}</p>
                  </div>
                  {isOwnComment && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-xs text-red-400 hover:text-red-300 flex-shrink-0"
                    >
                      Sil
                    </button>
                  )}
                </div>
              )
            })
          )}

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleAddComment()
                }
              }}
              placeholder="Yorum ekle..."
              className="flex-1 bg-surface-elevated border border-border rounded px-3 py-2 text-sm text-tx-primary placeholder:text-tx-muted focus:outline-none focus:border-blue-500"
            />
            <Button variant="primary" size="sm" onClick={handleAddComment} disabled={loading || !newComment.trim()}>
              Gönder
            </Button>
          </div>
        </div>

        <div className="p-4 border-t border-border flex-shrink-0">
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Görevi Sil
          </Button>
        </div>
      </div>
    </>
  )
}
