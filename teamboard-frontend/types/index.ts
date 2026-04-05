export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface ProjectMember {
  id: string
  user_id: string
  name: string
  email: string
  role: 'admin' | 'member'
}

export interface Project {
  id: string
  name: string
  description: string | null
  owner_id: string
  member_count: number
  created_at: string
  members?: ProjectMember[]
}

export type TaskStatus = 'todo' | 'inprogress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  project_id: string
  created_by: string
  assigned_to: string | null
  assigned_to_name?: string
  assigned_to_email?: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  created_at: string
}

export interface Comment {
  id: string
  task_id: string
  user_id: string
  user_name: string
  user_email: string
  content: string
  created_at: string
}

export interface BoardData {
  todo: Task[]
  inprogress: Task[]
  done: Task[]
}
