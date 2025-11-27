export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

export type ApiOptions = RequestInit & { auth?: boolean }

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (options.auth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers, cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || `Request failed: ${res.status}`)
  }
  return res.json()
}
