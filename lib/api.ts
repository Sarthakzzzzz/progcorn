export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

export type ApiOptions = RequestInit & { auth?: boolean }

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (options.auth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }
  const url = `${API_BASE}${path}`
  // simple retry: 1 retry on network error
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { ...options, headers, cache: 'no-store' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = err?.error || `Request failed: ${res.status} at ${url}`
        if (res.status === 404) throw new Error(`${msg}`)
        throw new Error(msg)
      }
      return res.json()
    } catch (e: any) {
      if (attempt === 1) throw new Error(e?.message || 'Network error')
      await new Promise((r) => setTimeout(r, 300))
    }
  }
  throw new Error('Network error')
}
