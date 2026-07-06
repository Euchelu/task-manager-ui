export type Priority = 'low' | 'medium' | 'high'
export type Filter = 'all' | 'pending' | 'completed'

export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  priority: Priority
  created_at: string
  updated_at: string | null
}

export interface TaskCreate {
  title: string
  description?: string
  priority: Priority
}

export interface TaskUpdate {
  title?: string
  description?: string
  completed?: boolean
  priority?: Priority
}
