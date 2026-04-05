'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { StatCard } from '@/components/project/StatCard'
import { ProjectCard } from '@/components/project/ProjectCard'
import { projectsApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

interface CreateProjectForm {
  name: string
  description: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectForm>()

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      const res = await projectsApi.list()
      setProjects(res.data.projects)
    } catch (error) {
      console.error('Projeler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  async function onCreateProject(data: CreateProjectForm) {
    try {
      await projectsApi.create(data)
      await loadProjects()
      setIsCreateModalOpen(false)
      reset()
    } catch (error) {
      console.error('Proje oluşturulamadı:', error)
    }
  }

  const totalMembers = projects.reduce((sum, p) => sum + (p.member_count || 0), 0)

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-subtle animate-pulse rounded-lg p-4" />
        ))}
        <div className="col-span-3 bg-surface-subtle animate-pulse rounded-lg h-64" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="TOPLAM PROJE" value={projects.length} />
        <StatCard label="AKTİF PROJELER" value={projects.length} />
        <StatCard label="TOPLAM ÜYE" value={totalMembers} sub={totalMembers > 0 ? 'Şimdi' : undefined} subColor="green" />
        <StatCard label="SON GÜNCELLEME" value="Bugün" />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-tx-primary uppercase tracking-wider">
          PROJELERİM
        </h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Yeni Proje
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-tx-muted mb-4">Henüz proje yok</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            İlk projeyi oluştur
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => router.push(`/projects/${project.id}/board`)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-base font-semibold text-tx-primary mb-4">
            Yeni Proje Oluştur
          </h3>
          <form onSubmit={handleSubmit(onCreateProject)} className="flex flex-col gap-4">
            <Input
              label="Proje Adı"
              placeholder="Örn: E-Ticaret Redesign"
              error={errors.name?.message}
              {...register('name', { required: 'Proje adı zorunludur.' })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-tx-label uppercase tracking-wider font-medium">
                Açıklama
              </label>
              <textarea
                placeholder="Proje hakkında kısa bilgi (opsiyonel)"
                rows={3}
                className={cn(
                  'w-full bg-surface-elevated border border-border rounded px-3 py-2',
                  'text-sm text-tx-primary placeholder:text-tx-muted',
                  'focus:outline-none focus:border-blue-500 transition-colors resize-none'
                )}
                {...register('description')}
              />
            </div>

            <div className="flex gap-2 justify-end mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateModalOpen(false)}
              >
                İptal
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Oluşturuluyor...' : 'Oluştur'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}
