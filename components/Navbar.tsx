"use client"
import Link from 'next/link'
import { useAuth } from '../lib/auth'
import Button from './ui/Button'

export default function Navbar() {
  const { user, logout, loading } = useAuth()
  return (
    <header className="mb-6 flex items-center justify-between">
      <Link href="/" className="text-xl font-semibold tracking-tight">PRHub</Link>
      <nav className="flex gap-2 text-sm items-center">
        <Link href="/search"><Button variant="ghost">Search</Button></Link>
        <Link href="/collections"><Button variant="ghost">Collections</Button></Link>
        {user?.role === 'ADMIN' && (
          <Link href="/admin"><Button variant="ghost">Admin</Button></Link>
        )}
        <Link href="/submit"><Button variant="secondary">Submit</Button></Link>
        {loading ? (
          <span className="text-gray-500 ml-2">Loading...</span>
        ) : user ? (
          <div className="flex items-center gap-2 ml-2">
            <Link href={`/profile/${user.username}`} className="text-sm">
              @{user.username}
            </Link>
            <Button size="sm" variant="ghost" onClick={logout}>Logout</Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-2">
            <Link href="/login"><Button size="sm" variant="ghost">Login</Button></Link>
            <Link href="/register"><Button size="sm" variant="primary">Register</Button></Link>
          </div>
        )}
      </nav>
    </header>
  )
}
