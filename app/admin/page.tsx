"use client"
import { useCallback } from 'react'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

type Resource = {
  id: string
  title: string
  url: string
  description: string
  author: { id: string; username: string }
  category: { id: string; name: string }
  tags: { tag: { id: string; name: string } }[]
  createdAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

type Announcement = { id: string; title: string; url?: string | null; published: boolean; createdAt: string }
type Category = { id: string; name: string; slug: string }
type Tag = { id: string; name: string; slug: string }

const TABS = { PENDING: 'PENDING', APPROVED: 'APPROVED', REJECTED: 'REJECTED', ANNOUNCEMENTS: 'ANNOUNCEMENTS', CATEGORIES: 'CATEGORIES', TAGS: 'TAGS' } as const
type Tab = typeof TABS[keyof typeof TABS]

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('PENDING')
  const [items, setItems] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [anns, setAnns] = useState<Announcement[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [newAnn, setNewAnn] = useState({ title: '', url: '' })
  const [newCat, setNewCat] = useState({ name: '', slug: '' })
  const [newTag, setNewTag] = useState({ name: '', slug: '' })
  const [selected, setSelected] = useState<string[]>([])
  const [toast, setToast] = useState<{ text: string; kind: 'success' | 'error' } | null>(null)
  const [editingCat, setEditingCat] = useState<string | null>(null)
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [catDraft, setCatDraft] = useState<{ name: string; slug: string }>({ name: '', slug: '' })
  const [tagDraft, setTagDraft] = useState<{ name: string; slug: string }>({ name: '', slug: '' })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (tab === TABS.ANNOUNCEMENTS) {
        const d = await api<{ announcements: Announcement[] }>(`/admin/announcements`, { auth: true })
        setAnns(d.announcements)
      } else if (tab === TABS.CATEGORIES) {
        const d = await api<{ categories: Category[] }>(`/admin/categories`, { auth: true })
        setCats(d.categories)
      } else if (tab === TABS.TAGS) {
        const d = await api<{ tags: Tag[] }>(`/admin/tags`, { auth: true })
        setTags(d.tags)
      } else {
        const data = await api<{ resources: Resource[] }>(`/admin/resources?status=${tab}`, { auth: true })
        setItems(data.resources)
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load data.')
      setToast({ text: e?.message || 'Failed to load data.', kind: 'error' })
    } finally { setLoading(false) }
  }, [tab])

  useEffect(() => { load() }, [load])

  const act = async (id: string, action: 'approve' | 'reject') => {
    await api(`/admin/resource/${id}/${action}`, { method: 'POST', auth: true })
    setToast({ text: `Resource ${action}d`, kind: 'success' })
    await load()
  }

  const delResource = async (id: string) => {
    await api(`/admin/resource/${id}`, { method: 'DELETE', auth: true })
    setToast({ text: 'Resource deleted', kind: 'success' })
    await load()
  }

  const bulk = async (action: 'APPROVE' | 'REJECT' | 'DELETE') => {
    if (selected.length === 0) return
    if (action === 'DELETE' && !confirm(`Delete ${selected.length} resource(s)?`)) return
    await api(`/admin/resources/bulk`, { method: 'POST', auth: true, body: JSON.stringify({ ids: selected, action }) })
    setToast({ text: `Bulk ${action.toLowerCase()} completed`, kind: 'success' })
    setSelected([])
    await load()
  }

  const addAnnouncement = async () => {
    if (!newAnn.title) return
    try {
      await api(`/admin/announcements`, { method: 'POST', auth: true, body: JSON.stringify({ title: newAnn.title, url: newAnn.url || null }) })
      setNewAnn({ title: '', url: '' })
      setToast({ text: 'Announcement created', kind: 'success' })
      await load()
    } catch (e: any) {
      setToast({ text: e?.message || 'Failed to create announcement', kind: 'error' })
    }
  }
  const updateAnnouncement = async (a: Announcement) => {
    try {
      await api(`/admin/announcements/${a.id}`, { method: 'PUT', auth: true, body: JSON.stringify({ title: a.title, url: a.url, published: a.published }) })
      setToast({ text: 'Announcement updated', kind: 'success' })
      await load()
    } catch (e: any) {
      setToast({ text: e?.message || 'Failed to update announcement', kind: 'error' })
    }
  }
  const togglePublish = async (a: Announcement) => {
    try {
      await api(`/admin/announcements/${a.id}`, { method: 'PUT', auth: true, body: JSON.stringify({ published: !a.published }) })
      setToast({ text: a.published ? 'Announcement unpublished' : 'Announcement published', kind: 'success' })
      await load()
    } catch (e: any) {
      setToast({ text: e?.message || 'Failed to toggle publish status', kind: 'error' })
    }
  }
  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    try {
      await api(`/admin/announcements/${id}`, { method: 'DELETE', auth: true })
      setToast({ text: 'Announcement deleted', kind: 'success' })
      await load()
    } catch (e: any) {
      setToast({ text: e?.message || 'Failed to delete announcement', kind: 'error' })
    }
  }

  const addCategory = async () => {
    if (!newCat.name || !newCat.slug) return
    try {
      await api(`/admin/categories`, { method: 'POST', auth: true, body: JSON.stringify(newCat) })
      setNewCat({ name: '', slug: '' })
      setToast({ text: 'Category created', kind: 'success' })
      await load()
    } catch (e: any) {
      setToast({ text: e?.message || 'Failed to create category', kind: 'error' })
    }
  }
  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Resources using it will fail until updated.')) return
    try {
      await api(`/admin/categories/${id}`, { method: 'DELETE', auth: true })
      setToast({ text: 'Category deleted', kind: 'success' })
      await load()
    } catch (e: any) {
      setToast({ text: e?.message || 'Failed to delete category', kind: 'error' })
    }
  }

  const startEditCat = (c: Category) => { setEditingCat(c.id); setCatDraft({ name: c.name, slug: c.slug }) }
  const saveCat = async (id: string) => {
    try {
      await api(`/admin/categories/${id}`, { method: 'PUT', auth: true, body: JSON.stringify(catDraft) })
      setToast({ text: 'Category updated', kind: 'success' })
      setEditingCat(null)
      await load()
    } catch (e: any) { setToast({ text: e?.message || 'Update failed', kind: 'error' }) }
  }
  const cancelCat = () => { setEditingCat(null) }

  const addTag = async () => {
    if (!newTag.name || !newTag.slug) return
    try {
      await api(`/admin/tags`, { method: 'POST', auth: true, body: JSON.stringify(newTag) })
      setNewTag({ name: '', slug: '' })
      setToast({ text: 'Tag created', kind: 'success' })
      await load()
    } catch (e: any) {
      setToast({ text: e?.message || 'Failed to create tag', kind: 'error' })
    }
  }
  const deleteTag = async (id: string) => {
    if (!confirm('Delete this tag?')) return
    try {
      await api(`/admin/tags/${id}`, { method: 'DELETE', auth: true })
      setToast({ text: 'Tag deleted', kind: 'success' })
      await load()
    } catch (e: any) {
      setToast({ text: e?.message || 'Failed to delete tag', kind: 'error' })
    }
  }
  const startEditTag = (t: Tag) => { setEditingTag(t.id); setTagDraft({ name: t.name, slug: t.slug }) }
  const saveTag = async (id: string) => {
    try {
      await api(`/admin/tags/${id}`, { method: 'PUT', auth: true, body: JSON.stringify(tagDraft) })
      setToast({ text: 'Tag updated', kind: 'success' })
      setEditingTag(null)
      await load()
    } catch (e: any) { setToast({ text: e?.message || 'Update failed', kind: 'error' }) }
  }
  const cancelTag = () => { setEditingTag(null) }

  return (
    <div>
      {!!toast && (
        <div className={`fixed top-4 right-4 z-50 rounded px-3 py-2 text-sm shadow ${toast.kind==='success'?'bg-green-600 text-white':'bg-red-600 text-white'}`}
          onAnimationEnd={() => setToast(null)}>{toast.text}</div>
      )}
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.values(TABS)).map(s => (
          <button key={s} onClick={() => setTab(s)} className={`rounded border px-3 py-1 text-sm ${tab===s?'bg-black text-white':''}`}>{s}</button>
        ))}
      </div>
      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {tab === TABS.PENDING || tab === TABS.APPROVED || tab === TABS.REJECTED ? (
        <div className="space-y-3">
          {items.length > 0 && (
            <div className="flex items-center gap-2 mb-1">
              <button onClick={() => bulk('APPROVE')} disabled={selected.length===0} className="rounded bg-green-600 text-white px-3 py-1 text-xs disabled:opacity-50">Bulk Approve</button>
              <button onClick={() => bulk('REJECT')} disabled={selected.length===0} className="rounded bg-yellow-600 text-white px-3 py-1 text-xs disabled:opacity-50">Bulk Reject</button>
              <button onClick={() => bulk('DELETE')} disabled={selected.length===0} className="rounded bg-gray-800 text-white px-3 py-1 text-xs disabled:opacity-50">Bulk Delete</button>
              <span className="text-xs text-gray-600">Selected: {selected.length}</span>
            </div>
          )}
          {items.map(r => (
            <div key={r.id} className="rounded border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2"><label className="inline-flex items-center gap-2 text-xs"><input type="checkbox" checked={selected.includes(r.id)} onChange={(e)=>{
                    const on = e.target.checked
                    setSelected(prev => on ? Array.from(new Set([...prev, r.id])) : prev.filter(x=>x!==r.id))
                  }} /> Select</label></div>
                  <div className="font-semibold">{r.title}</div>
                  <a href={r.url} target="_blank" className="text-xs underline" rel="noreferrer">{r.url}</a>
                  <div className="text-xs text-gray-600">by @{r.author.username} • {r.category.name}</div>
                  <p className="mt-2 text-sm max-w-3xl">{r.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {r.tags.map(t => <span key={t.tag.id} className="rounded bg-gray-100 px-2 py-0.5 text-xs">#{t.tag.name}</span>)}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {r.status === 'PENDING' && (
                    <>
                      <button onClick={() => act(r.id, 'approve')} className="rounded bg-green-600 text-white px-3 py-1 text-xs">Approve</button>
                      <button onClick={() => act(r.id, 'reject')} className="rounded bg-red-600 text-white px-3 py-1 text-xs">Reject</button>
                    </>
                  )}
                  <button onClick={() => { if (confirm('Delete this resource?')) delResource(r.id) }} className="rounded bg-gray-800 text-white px-3 py-1 text-xs">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {!loading && items.length === 0 && <div className="text-sm text-gray-500">No items.</div>}
        </div>
      ) : null}

      {tab === TABS.ANNOUNCEMENTS && (
        <div className="space-y-3">
          <div className="rounded border p-3 flex gap-2">
            <input placeholder="Title" className="border rounded px-2 py-1 text-sm flex-1" value={newAnn.title} onChange={(e)=>setNewAnn(a=>({...a,title:e.target.value}))} />
            <input placeholder="URL (optional)" className="border rounded px-2 py-1 text-sm flex-1" value={newAnn.url} onChange={(e)=>setNewAnn(a=>({...a,url:e.target.value}))} />
            <button onClick={addAnnouncement} className="rounded bg-black text-white px-3 py-1 text-sm">Add</button>
          </div>
          {anns.map((a, i) => (
            <div key={a.id} className="rounded border p-3 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <input className="border rounded px-2 py-1 text-sm w-full mb-1" value={a.title} onChange={(e)=>setAnns(prev=>prev.map((x,idx)=>idx===i?{...x,title:e.target.value}:x))} />
                <input className="border rounded px-2 py-1 text-xs w-full" placeholder="URL" value={a.url||''} onChange={(e)=>setAnns(prev=>prev.map((x,idx)=>idx===i?{...x,url:e.target.value}:x))} />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>togglePublish(a)} className={`rounded px-3 py-1 text-xs ${a.published?'bg-green-600 text-white':'bg-gray-200'}`}>{a.published?'Published':'Unpublished'}</button>
                <button onClick={()=>updateAnnouncement(a)} className="rounded bg-black text-white px-3 py-1 text-xs">Save</button>
                <button onClick={()=>deleteAnnouncement(a.id)} className="rounded bg-gray-800 text-white px-3 py-1 text-xs">Delete</button>
              </div>
            </div>
          ))}
          {!loading && anns.length === 0 && <div className="text-sm text-gray-500">No announcements.</div>}
        </div>
      )}

      {tab === TABS.CATEGORIES && (
        <div className="space-y-3">
          <div className="rounded border p-3 flex gap-2">
            <input placeholder="Name" className="border rounded px-2 py-1 text-sm flex-1" value={newCat.name} onChange={(e)=>setNewCat(c=>({...c,name:e.target.value}))} />
            <input placeholder="Slug" className="border rounded px-2 py-1 text-sm flex-1" value={newCat.slug} onChange={(e)=>setNewCat(c=>({...c,slug:e.target.value}))} />
            <button onClick={addCategory} className="rounded bg-black text-white px-3 py-1 text-sm">Add</button>
          </div>
          {cats.map(c => (
            <div key={c.id} className="rounded border p-3 flex items-center justify-between gap-2">
              <div className="flex-1">
                {editingCat===c.id ? (
                  <div className="flex gap-2">
                    <input className="border rounded px-2 py-1 text-sm flex-1" value={catDraft.name} onChange={(e)=>setCatDraft(s=>({...s,name:e.target.value}))} />
                    <input className="border rounded px-2 py-1 text-sm flex-1" value={catDraft.slug} onChange={(e)=>setCatDraft(s=>({...s,slug:e.target.value}))} />
                  </div>
                ) : (
                  <>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-600">/{c.slug}</div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editingCat===c.id ? (
                  <>
                    <button onClick={()=>saveCat(c.id)} className="rounded bg-black text-white px-3 py-1 text-xs">Save</button>
                    <button onClick={cancelCat} className="rounded bg-gray-300 px-3 py-1 text-xs">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={()=>startEditCat(c)} className="rounded bg-gray-200 px-3 py-1 text-xs">Edit</button>
                    <button onClick={()=>deleteCategory(c.id)} className="rounded bg-gray-800 text-white px-3 py-1 text-xs">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
          {!loading && cats.length === 0 && <div className="text-sm text-gray-500">No categories.</div>}
        </div>
      )}

      {tab === TABS.TAGS && (
        <div className="space-y-3">
          <div className="rounded border p-3 flex gap-2">
            <input placeholder="Name" className="border rounded px-2 py-1 text-sm flex-1" value={newTag.name} onChange={(e)=>setNewTag(t=>({...t,name:e.target.value}))} />
            <input placeholder="Slug" className="border rounded px-2 py-1 text-sm flex-1" value={newTag.slug} onChange={(e)=>setNewTag(t=>({...t,slug:e.target.value}))} />
            <button onClick={addTag} className="rounded bg-black text-white px-3 py-1 text-sm">Add</button>
          </div>
          {tags.map(t => (
            <div key={t.id} className="rounded border p-3 flex items-center justify-between gap-2">
              <div className="flex-1">
                {editingTag===t.id ? (
                  <div className="flex gap-2">
                    <input className="border rounded px-2 py-1 text-sm flex-1" value={tagDraft.name} onChange={(e)=>setTagDraft(s=>({...s,name:e.target.value}))} />
                    <input className="border rounded px-2 py-1 text-sm flex-1" value={tagDraft.slug} onChange={(e)=>setTagDraft(s=>({...s,slug:e.target.value}))} />
                  </div>
                ) : (
                  <>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-gray-600">/{t.slug}</div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editingTag===t.id ? (
                  <>
                    <button onClick={()=>saveTag(t.id)} className="rounded bg-black text-white px-3 py-1 text-xs">Save</button>
                    <button onClick={cancelTag} className="rounded bg-gray-300 px-3 py-1 text-xs">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={()=>startEditTag(t)} className="rounded bg-gray-200 px-3 py-1 text-xs">Edit</button>
                    <button onClick={()=>deleteTag(t.id)} className="rounded bg-gray-800 text-white px-3 py-1 text-xs">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
          {!loading && tags.length === 0 && <div className="text-sm text-gray-500">No tags.</div>}
        </div>
      )}
    </div>
  )
}
