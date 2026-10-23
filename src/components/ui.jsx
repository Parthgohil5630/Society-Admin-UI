import { useEffect } from 'react'

export function Spinner({ className = 'w-4 h-4' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-90" />
    </svg>
  )
}

const VARIANTS = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25',
  dark: 'bg-slate-900 hover:bg-slate-800 text-white',
  ghost: 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20',
}

export function Button({ variant = 'primary', loading = false, disabled, className = '', children, ...rest }) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600/30 disabled:opacity-60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

export function Field({ label, error, hint, className = '', ...rest }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className={`text-xs font-semibold uppercase tracking-wider block ${error ? 'text-red-600' : 'text-slate-600'}`}>
        {label}
      </label>
      <input
        className={`w-full px-3.5 py-2.5 border rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
          error
            ? 'border-red-500 focus:ring-red-500/20'
            : 'border-slate-200 focus:ring-indigo-600/20 focus:border-indigo-600'
        }`}
        {...rest}
      />
      {error ? (
        <p className="text-[11px] font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}

export function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative animate-pop w-full ${width} bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer" aria-label="Close">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger', loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-md">
      <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant={variant} loading={loading} onClick={onConfirm}>{confirmText}</Button>
      </div>
    </Modal>
  )
}

export function Avatar({ text, size = 'h-9 w-9 text-xs' }) {
  return (
    <div className={`${size} rounded-full bg-linear-to-tr from-indigo-500 to-amber-400 text-white font-bold flex items-center justify-center shrink-0`}>
      {text}
    </div>
  )
}
