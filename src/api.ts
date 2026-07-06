import type { Task, TaskCreate, TaskUpdate } from './types'

const BASE = '/api'

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (res.status === 204) return undefined as T
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.detail ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  list: () => req<Task[]>('/tasks'),
  create: (data: TaskCreate) => req<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: TaskUpdate) => req<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: number) => req<void>(`/tasks/${id}`, { method: 'DELETE' }),
}
