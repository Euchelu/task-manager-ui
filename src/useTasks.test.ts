import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTasks } from './useTasks'
import type { Task } from './types'

const TASK: Task = {
  id: 1,
  title: 'Tarea original',
  description: null,
  completed: false,
  priority: 'medium',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: null,
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('useTasks — toggle (optimistic update)', () => {
  it('revierte al estado anterior si la API falla', async () => {
    // GET /tasks inicial: una tarea sin completar
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [TASK] })
      // PATCH /tasks/1: falla
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ detail: 'boom' }) }))

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isDemo).toBe(false)

    await act(async () => {
      await result.current.toggle(1)
    })

    // Tras el fallo, la tarea vuelve a su estado original (sin completar)
    expect(result.current.tasks[0].completed).toBe(false)
  })

  it('confirma el cambio con la respuesta del servidor si la API responde bien', async () => {
    const updated = { ...TASK, completed: true }
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [TASK] })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => updated }))

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.toggle(1)
    })

    expect(result.current.tasks[0].completed).toBe(true)
  })

  it('en modo demo no llama a la API y el cambio se mantiene', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('sin backend')))

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.isDemo).toBe(true))

    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    await act(async () => {
      await result.current.toggle(result.current.tasks[0].id)
    })

    expect(fetchSpy).not.toHaveBeenCalled()
  })
})

describe('useTasks — remove (optimistic update)', () => {
  it('si la API falla, recarga la lista desde el servidor', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [TASK] })
      // DELETE /tasks/1: falla
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ detail: 'boom' }) })
      // load() de recuperación: la tarea sigue existiendo en el servidor
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [TASK] }))

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.remove(1)
    })

    await waitFor(() => expect(result.current.tasks).toHaveLength(1))
  })
})

describe('useTasks — create', () => {
  it('registra un mensaje de error si la API falla (sin romper la UI)', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] })
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ detail: 'boom' }) }))

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.create({ title: 'Nueva tarea', priority: 'low' })
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.tasks).toHaveLength(0)
  })
})
