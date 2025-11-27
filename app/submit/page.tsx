"use client"
import { FormEvent, useEffect, useState } from 'react'
import { api } from '../../lib/api'

type Category = { id: string; name: string; slug: string }
type Tag = { id: string; name: string; slug: string }

export default function SubmitPage() {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const c = await api<{ categories: Category[] }>(`/categories`)
      setCategories(c.categories)
      const t = await api<{ tags: Tag[] }>(`/tags`)
      setTags(t.tags)
    })()
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOk(null)
    try {
      const res = await api<{ resource: any }>(`/resources`, {
        method: 'POST', auth: true,
        body: JSON.stringify({ title, url, description, imageUrl, categoryId, tags: selectedTags })
      })
      setOk('Submitted!')
      setTitle(''); setUrl(''); setDescription(''); setImageUrl(''); setCategoryId(''); setSelectedTags([])
      window.location.href = `/resources/${res.resource.id}`
    } catch (e: any) { setError(e?.message || 'Failed to submit') } finally { setLoading(false) }
  }

  const toggleTag = (id: string) => {
    setSelectedTags((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Submit Resource</h1>
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
      {ok && <div className="mb-3 text-sm text-green-600">{ok}</div>}
      <form onSubmit={onSubmit} className="space-y-3 max-w-2xl">
        <input className="w-full rounded border px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="w-full rounded border px-3 py-2 text-sm" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <textarea className="w-full rounded border px-3 py-2 text-sm" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="w-full rounded border px-3 py-2 text-sm" placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <select className="w-full rounded border px-3 py-2 text-sm" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button type="button" key={t.id} onClick={() => toggleTag(t.id)}
              className={`rounded px-2 py-1 text-xs border ${selectedTags.includes(t.id) ? 'bg-black text-white' : ''}`}>#{t.name}</button>
          ))}
        </div>
        <button disabled={loading} className="rounded bg-black text-white px-4 py-2 text-sm">{loading ? 'Submitting...' : 'Submit'}</button>
      </form>
    </div>
  )
}
