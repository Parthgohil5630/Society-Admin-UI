import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { authApi } from '../../lib/api.js'
import { Button, Field } from '../../components/ui.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function NewPasswordPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const email = sessionStorage.getItem('resetEmail')
  const verified = sessionStorage.getItem('otpVerified')

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (!email || !verified) return <Navigate to="/forgot-password" replace />

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setErrors({ ...errors, [k]: '' }) }

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (form.password.length < 8) errs.password = 'Use at least 8 characters'
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)
    const res = await authApi.changePassword(email, form.password, form.confirm)
    setLoading(false)
    if (res.error) return setErrors({ confirm: res.message })

    sessionStorage.removeItem('resetEmail')
    sessionStorage.removeItem('otpVerified')
    toast.success(res.message)
    navigate('/login', { replace: true })
  }

  return (
    <>
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Almost done</div>
        <h2 className="text-2xl font-bold tracking-tight">Set a new password</h2>
        <p className="text-sm text-slate-500">Choose a strong password for <span className="font-semibold text-slate-800">{email}</span>.</p>
      </div>

      <form onSubmit={submit} className="space-y-5" noValidate>
        <Field label="New Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={set('password')} error={errors.password} />
        <Field label="Confirm Password" type="password" autoComplete="new-password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        <Button type="submit" loading={loading} className="w-full">{loading ? 'Saving...' : 'Reset password'}</Button>
      </form>
    </>
  )
}
