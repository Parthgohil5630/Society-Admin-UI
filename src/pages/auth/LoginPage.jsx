import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { Button, Field } from '../../components/ui.jsx'
import { isEmail } from '../../lib/validate.js'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value })
    setErrors({ ...errors, [k]: '' })
    setServerError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!isEmail(form.email)) errs.email = 'Enter a valid email address'
    if (!form.password) errs.password = 'Password is required'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)
    const res = await login(form.email.trim(), form.password)
    setLoading(false)
    if (res.error) return setServerError(res.message)
    navigate(location.state?.from || '/dashboard', { replace: true })
  }

  return (
    <>
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Administrative Gateway</div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500">Sign in with your admin credentials to continue.</p>
      </div>

      <form onSubmit={submit} className="space-y-5" noValidate>
        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{serverError}</div>
        )}

        <Field label="Admin Email" type="email" autoComplete="username" placeholder="admin@society.com" value={form.email} onChange={set('email')} error={errors.email} />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${errors.password ? 'text-red-600' : 'text-slate-600'}`}>Password</span>
            <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={form.password}
              onChange={set('password')}
              className={`w-full px-3.5 py-2.5 pr-16 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-indigo-600/20 focus:border-indigo-600'}`}
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer">
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-[11px] font-medium text-red-600">{errors.password}</p>}
        </div>

        <Button type="submit" loading={loading} className="w-full">{loading ? 'Signing in...' : 'Login'}</Button>
      </form>
    </>
  )
}
