"use client"
import { FormEvent, useState } from 'react'
import { useAuth } from '../../lib/auth'

export default function RegisterPage() {
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await register(username, email, password)
      window.location.href = '/'
    } catch (e: any) { setError(e?.message || 'Register failed') } finally { setLoading(false) }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="max-w-md space-y-3">
        <input className="w-full rounded border px-3 py-2 text-sm" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="w-full rounded border px-3 py-2 text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full rounded border px-3 py-2 text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="rounded bg-black text-white px-4 py-2 text-sm">{loading ? 'Creating...' : 'Register'}</button>
      </form>
    </div>
  )
}
