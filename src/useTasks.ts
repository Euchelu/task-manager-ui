import { useState, useEffect, useCallback } from 'react'
import type { Task, TaskCreate, TaskUpdate } from './types'
import { api } from './api'
import { MOCK_TASKS } from './mockData'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await api.list()
      setTasks(data)
      setIsDemo(false)
    } catch {
      setTasks(MOCK_TASKS)
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const create = async (data: TaskCreate) => {
    if (isDemo) {
      const next: Task = { id: Date.now(), ...data, description: data.description ?? null, completed: false, created_at: new Date().toISOString(), updated_at: null }
      setTasks((t) => [next, ...t])
      return
    }
    try {
      const task = await api.create(data)
      setTasks((t) => [task, ...t])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear tarea')
    }
  }

  const toggle = async (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    const updated = { ...task, completed: !task.completed }
    setTasks((t) => t.map((x) => (x.id === id ? updated : x)))
    if (!isDemo) {
      try {
        const res = await api.update(id, { completed: updated.completed })
        setTasks((t) => t.map((x) => (x.id === id ? res : x)))
      } catch {
        setTasks((t) => t.map((x) => (x.id === id ? task : x)))
      }
    }
  }

  const update = async (id: number, data: TaskUpdate) => {
    if (isDemo) {
      setTasks((t) => t.map((x) => (x.id === id ? { ...x, ...data } : x)))
      return
    }
    try {
      const res = await api.update(id, data)
      setTasks((t) => t.map((x) => (x.id === id ? res : x)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar')
    }
  }

  const remove = async (id: number) => {
    setTasks((t) => t.filter((x) => x.id !== id))
    if (!isDemo) {
      try {
        await api.remove(id)
      } catch {
        load()
      }
    }
  }

  return { tasks, loading, isDemo, error, setError, create, toggle, update, remove }
}
