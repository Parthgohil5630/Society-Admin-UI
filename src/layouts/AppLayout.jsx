import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'

export default function AppLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">
        <Sidebar />
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 animate-pop">
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="lg:hidden h-14 bg-white border-b border-slate-200 px-4 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setOpen(true)} className="h-9 w-9 rounded-xl border border-slate-200 text-slate-700 cursor-pointer" aria-label="Open menu">☰</button>
          <span className="font-extrabold tracking-tight">Society<span className="text-indigo-600">Hub</span></span>
        </header>

        <main className="flex-1 p-5 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>

        <footer className="h-12 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[11px] text-slate-400">
          <span>© 2026 SocietyHub</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Connected to API
          </span>
        </footer>
      </div>
    </div>
  )
}
