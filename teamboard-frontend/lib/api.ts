import axios from 'axios'
import type { Task, TaskPriority } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export const projectsApi = {
  list: () => api.get('/projects'),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post('/projects', data),
  update: (id: string, data: { name: string; description?: string }) =>
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  addMember: (id: string, email: string) =>
    api.post(`/projects/${id}/members`, { email }),
  removeMember: (id: string, userId: string) =>
    api.delete(`/projects/${id}/members/${userId}`),
}

export const tasksApi = {
  list: (projectId: string) => api.get(`/projects/${projectId}/tasks`),
  get: (id: string) => api.get(`/tasks/${id}`),
  create: (
    projectId: string,
    data: {
      title: string
      description?: string
      assignedTo?: string
      priority?: TaskPriority
      dueDate?: string
    }
  ) => api.post(`/projects/${projectId}/tasks`, data),
  update: (id: string, data: Partial<Task>) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
}

export const commentsApi = {
  list: (taskId: string) => api.get(`/tasks/${taskId}/comments`),
  create: (taskId: string, content: string) =>
    api.post(`/tasks/${taskId}/comments`, { content }),
  delete: (id: string) => api.delete(`/comments/${id}`),
}
