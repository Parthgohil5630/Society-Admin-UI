import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Avatar, Spinner } from '../../components/ui.jsx'
import { initials } from '../../lib/validate.js'

const day = (s) => (s ? s.split(',')[0] : '—')

export default function DashboardPage() {
  const { admin } = useAuth()
  const [admins, setAdmins] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi.list().then((res) => (res.error ? setError(res.message) : setAdmins(res.result || [])))
  }, [])

  const total = admins?.length ?? 0
  const neverLoggedIn = admins ? admins.filter((a) => !a.last_login).length : 0
  const newest = admins && admins.length ? admins[admins.length - 1] : null
  const recent = admins ? [...admins].reverse().slice(0, 5) : []

  const stats = [
    { label: 'Total admins', value: total, note: 'active accounts', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z' },
    { label: 'Never logged in', value: neverLoggedIn, note: 'waiting to sign in', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Newest admin', value: newest ? newest.first_name : '—', note: newest ? day(newest.created_at) : 'no admins yet', icon: 'M12 4.5v15m7.5-7.5h-15' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 text-white p-8 shadow-xl shadow-slate-900/10">
        <div className="absolute -top-16 -right-10 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">Dashboard</p>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">Welcome back, {admin?.first_name} 👋</h1>
            <p className="text-sm text-slate-300 mt-2">Last login: {admin?.last_login || 'first time here'}</p>
          </div>
          <Link to="/admins" className="self-start md:self-auto px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/30 transition">
            Manage admins →
          </Link>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
            </div>
            <div className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</div>
            <div className="mt-1 text-3xl font-extrabold text-slate-900 truncate">{admins ? s.value : '…'}</div>
            <div className="text-xs text-slate-400">{s.note}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold">Recently added admins</h2>
          <Link to="/admins" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View all</Link>
        </div>
        {!admins ? (
          <div className="p-10 flex justify-center text-indigo-600"><Spinner className="w-6 h-6" /></div>
        ) : recent.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-400">No admins found.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((a) => (
              <li key={a._id} className="px-6 py-3.5 flex items-center gap-3">
                <Avatar text={initials(a)} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{a.first_name} {a.last_name}</div>
                  <div className="text-xs text-slate-400 truncate">{a.email}</div>
                </div>
                <div className="text-xs text-slate-400 hidden sm:block">{day(a.created_at)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
