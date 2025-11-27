"use client"
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { api } from './api'

type User = { id: string; username: string; email: string; role: 'USER' | 'ADMIN' }

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (t) setToken(t)
    setLoading(false)
  }, [])

  const refresh = async () => {
    if (!token) { setUser(null); return }
    try {
      const data = await api<{ user: User }>(`/auth/me`, { auth: true })
      setUser(data.user)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => { refresh() }, [token])

  const login = async (email: string, password: string) => {
    const data = await api<{ token: string; user: User }>(`/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (username: string, email: string, password: string) => {
    const data = await api<{ token: string; user: User }>(`/auth/register`, { method: 'POST', body: JSON.stringify({ username, email, password }) })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ user, token, loading, login, register, logout, refresh }), [user, token, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
