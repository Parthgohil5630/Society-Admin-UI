import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminApi } from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Avatar, Button, ConfirmModal, Spinner } from '../../components/ui.jsx'
import { initials } from '../../lib/validate.js'
import AdminFormModal from './AdminFormModal.jsx'

const day = (s) => (s ? s.split(',')[0] : '—')

export default function AdminsPage() {
  const { admin: me } = useAuth()
  const toast = useToast()

  const [admins, setAdmins] = useState(null)
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null) // { type: 'toggle' | 'delete', admin }
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const res = await adminApi.list()
    if (res.error) {
      toast.error(res.message)
      setAdmins((a) => a ?? [])
      return
    }
    setAdmins(res.result || [])
  }, [toast])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!admins) return []
    if (!q) return admins
    return admins.filter((a) =>
      `${a.first_name} ${a.last_name} ${a.email} ${a.number}`.toLowerCase().includes(q),
    )
  }, [admins, query])

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (a) => { setEditing(a); setFormOpen(true) }

  const runConfirm = async () => {
    setBusy(true)
    const { type, admin } = confirm
    const res = type === 'toggle' ? await adminApi.toggleActive(admin._id) : await adminApi.remove(admin._id)
    setBusy(false)
    setConfirm(null)
    if (res.error) return toast.error(res.message)
    toast.success(res.message)
    load()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admins</h1>
          <p className="text-sm text-slate-500 mt-0.5">Create, edit and manage who can access the society console.</p>
        </div>
        <Button onClick={openCreate}>+ Add admin</Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or number…"
            className="w-full sm:w-80 px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
          />
          <span className="text-xs text-slate-400 whitespace-nowrap">{filtered.length} admin{filtered.length === 1 ? '' : 's'}</span>
        </div>

        {!admins ? (
          <div className="p-16 flex justify-center text-indigo-600"><Spinner className="w-7 h-7" /></div>
        ) : filtered.length === 0 ? (
          <p className="p-16 text-center text-sm text-slate-400">{query ? 'No admins match your search.' : 'No admins yet. Add the first one!'}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Admin</th>
                  <th className="px-6 py-3">Mobile</th>
                  <th className="px-6 py-3">Last login</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => {
                  const isMe = a._id === me?._id
                  return (
                    <tr key={a._id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar text={initials(a)} />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 flex items-center gap-2">
                              {a.first_name} {a.last_name}
                              {isMe && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600">YOU</span>}
                            </div>
                            <div className="text-xs text-slate-400 truncate">{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 whitespace-nowrap">{a.number}</td>
                      <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">{a.last_login || '—'}</td>
                      <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">{day(a.created_at)}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(a)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer">Edit</button>
                          <button disabled={isMe} onClick={() => setConfirm({ type: 'toggle', admin: a })} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">Deactivate</button>
                          <button disabled={isMe} onClick={() => setConfirm({ type: 'delete', admin: a })} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminFormModal open={formOpen} admin={editing} onClose={() => setFormOpen(false)} onSaved={load} />

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
        loading={busy}
        variant={confirm?.type === 'delete' ? 'danger' : 'dark'}
        confirmText={confirm?.type === 'delete' ? 'Delete admin' : 'Deactivate'}
        title={confirm?.type === 'delete' ? 'Delete this admin?' : 'Deactivate this admin?'}
        message={
          confirm
            ? confirm.type === 'delete'
              ? `${confirm.admin.first_name} ${confirm.admin.last_name} will be removed and can no longer sign in.`
              : `${confirm.admin.first_name} ${confirm.admin.last_name} will be blocked from signing in and will disappear from this list.`
            : ''
        }
      />
    </div>
  )
}
