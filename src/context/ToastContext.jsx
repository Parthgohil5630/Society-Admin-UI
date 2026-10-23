import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((type, message) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])

  const toast = useMemo(() => ({
    success: (m) => push('success', m),
    error: (m) => push('error', m),
  }), [push])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-pop flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg text-sm font-medium bg-white ${
              t.type === 'success' ? 'border-emerald-200 text-emerald-700' : 'border-red-200 text-red-600'
            }`}
          >
            <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${t.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
