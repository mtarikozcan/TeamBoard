'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BadgeLabel } from '@/components/ui/Badge'
import { projectsApi } from '@/lib/api'
import { cn, getInitials } from '@/lib/utils'
import type { Project, ProjectMember } from '@/types'

interface SettingsPageProps {
  params: { id: string }
}

interface ProjectForm {
  name: string
  description: string
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const projectId = params.id

  const [project, setProject] = useState<Project | null>(null)
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saveMessage, setSaveMessage] = useState<'saved' | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)

  const {
    register: registerProject,
    handleSubmit: handleProjectSubmit,
    reset: resetProject,
    formState: { errors: projectErrors, isSubmitting },
  } = useForm<ProjectForm>()

  useEffect(() => {
    loadProject()
  }, [])

  async function loadProject() {
    try {
      const res = await projectsApi.get(projectId)
      const proj = res.data.project
      setProject(proj)
      setMembers(proj.members ?? [])
      resetProject({
        name: proj.name,
        description: proj.description ?? '',
      })
    } catch (error) {
      console.error('Proje yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  async function onUpdateProject(data: ProjectForm) {
    try {
      await projectsApi.update(projectId, {
        name: data.name,
        description: data.description || undefined,
      })

      await loadProject()
      setSaveMessage('saved')
      setTimeout(() => setSaveMessage(null), 2000)
    } catch (error) {
      console.error('Proje güncellenemedi:', error)
    }
  }

  async function onInviteMember() {
    if (!inviteEmail.trim()) return

    setInviting(true)
    try {
      await projectsApi.addMember(projectId, inviteEmail.trim())
      await loadProject()
      setInviteEmail('')
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Üye eklenemedi'
      alert(message)
    } finally {
      setInviting(false)
    }
  }

  async function onRemoveMember(userId: string) {
    if (!confirm('Bu üyeyi projeden çıkarmak istediğinize emin misiniz?')) return

    try {
      await projectsApi.removeMember(projectId, userId)
      await loadProject()
    } catch (error) {
      console.error('Üye çıkarılamadı:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-surface-subtle animate-pulse rounded-lg h-48" />
        <div className="bg-surface-subtle animate-pulse rounded-lg h-64" />
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="space-y-4">
      <section className="bg-surface-elevated border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold text-tx-primary mb-4">Proje Bilgileri</h3>

        <form onSubmit={handleProjectSubmit(onUpdateProject)} className="flex flex-col gap-4 max-w-md">
          <Input
            label="Proje Adı"
            error={projectErrors.name?.message}
            {...registerProject('name', { required: 'Proje adı zorunludur.' })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-tx-label uppercase tracking-wider font-medium">
              Açıklama
            </label>
            <textarea
              rows={3}
              className={cn(
                'w-full bg-surface-elevated border border-border rounded px-3 py-2',
                'text-sm text-tx-primary placeholder:text-tx-muted',
                'focus:outline-none focus:border-blue-500 transition-colors resize-none'
              )}
              placeholder="Proje açıklaması..."
              {...registerProject('description')}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
            {saveMessage === 'saved' && (
              <span className="text-xs text-green-400">Kaydedildi</span>
            )}
          </div>
        </form>
      </section>

      <section className="bg-surface-elevated border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold text-tx-primary mb-4">Üyeler</h3>

        <div className="flex flex-col gap-3 mb-4">
          {members.map((member) => (
            <div
              key={member.user_id}
              className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-blue-300 text-xs font-semibold flex items-center justify-center">
                  {getInitials(member.name)}
                </div>
                <div>
                  <p className="text-sm text-tx-primary font-medium">{member.name}</p>
                  <p className="text-xs text-tx-muted">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BadgeLabel status={member.role === 'admin' ? 'high' : 'todo'} label={member.role === 'admin' ? 'Admin' : 'Üye'} />
                {member.role !== 'admin' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onRemoveMember(member.user_id)}
                  >
                    Çıkar
                  </Button>
                )}
              </div>
            </div>
          ))}

          {members.length === 0 && (
            <p className="text-tx-muted text-sm py-4">Henüz üye yok</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="uye@email.com"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onInviteMember()
              }
            }}
            className="flex-1 bg-surface-subtle border border-border rounded px-3 py-2 text-sm text-tx-primary placeholder:text-tx-muted focus:outline-none focus:border-blue-500"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={onInviteMember}
            disabled={inviting || !inviteEmail.trim()}
          >
            {inviting ? 'Davet Ediliyor...' : 'Davet Et'}
          </Button>
        </div>
      </section>
    </div>
  )
}
