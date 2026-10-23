import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthLayout() {
  const { isAuthed, loading } = useAuth()
  if (!loading && isAuthed) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50">
      {/* form side */}
      <div className="w-full md:w-[55%] min-h-screen flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-8 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-900/5 p-8 sm:p-10 animate-fade-in">
          <div className="flex md:hidden items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm">S</div>
            <span className="text-lg font-extrabold tracking-tight">Society<span className="text-indigo-600">Hub</span></span>
          </div>
          <Outlet />
        </div>
      </div>

      {/* hero side */}
      <div className="hidden md:flex md:w-[45%] relative overflow-hidden flex-col justify-between p-12 lg:p-16 text-white bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[22px_22px]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 3 3 11h2.5v9h5v-5.5h3V20h5v-9H21z" /></svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight">Society<span className="text-indigo-400">Hub</span></span>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase bg-white/10 border border-white/20 px-3 py-1 rounded-full">Admin Portal</span>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Run your society <span className="text-indigo-400">effortlessly</span>.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage admins, residents and day-to-day society work from one clean, secure dashboard.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[['Secure', 'JWT auth'], ['Fast', 'Live data'], ['Simple', 'Clean UI']].map(([a, b]) => (
              <div key={a} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                <div className="text-lg font-bold">{a}</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider">{b}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 pt-6 border-t border-white/10">© 2026 SocietyHub</div>
      </div>
    </div>
  )
}
