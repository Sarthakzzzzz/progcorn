"use client"
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'

type Comment = { id: string; content: string; user: { id: string; username: string }; createdAt: string }

export default function CommentSection({ resourceId }: { resourceId: string }) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api<{ comments: Comment[] }>(`/resources/${resourceId}/comments`)
      setComments(data.comments)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [resourceId])

  const post = async () => {
    if (!user) return (window.location.href = '/login')
    if (!content.trim()) return
    await api(`/resources/${resourceId}/comments`, { method: 'POST', auth: true, body: JSON.stringify({ content }) })
    setContent('')
    await load()
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold">Comments</h3>
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-3 mt-2">
          {comments.map((c) => (
            <div key={c.id} className="rounded border p-2">
              <div className="text-xs text-gray-500">@{c.user.username}</div>
              <div className="text-sm">{c.content}</div>
            </div>
          ))}
          {comments.length === 0 && <div className="text-sm text-gray-500">No comments yet.</div>}
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a comment..." className="flex-1 rounded border px-2 py-1 text-sm" />
        <button onClick={post} className="rounded bg-black text-white px-3 py-1 text-sm">Post</button>
      </div>
    </div>
  )
}
