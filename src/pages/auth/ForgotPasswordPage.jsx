import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../lib/api.js'
import { Button, Field } from '../../components/ui.jsx'
import { isEmail } from '../../lib/validate.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!isEmail(email)) return setError('Enter a valid email address')

    setLoading(true)
    const res = await authApi.forgotPassword(email.trim())
    setLoading(false)
    if (res.error) return setError(res.message)

    sessionStorage.setItem('resetEmail', email.trim())
    sessionStorage.removeItem('otpVerified')
    toast.success(res.message)
    navigate('/verify-otp')
  }

  return (
    <>
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Account Recovery</div>
        <h2 className="text-2xl font-bold tracking-tight">Forgot your password?</h2>
        <p className="text-sm text-slate-500">Enter your admin email and we will send you a 6-digit code.</p>
      </div>

      <form onSubmit={submit} className="space-y-5" noValidate>
        <Field label="Admin Email" type="email" placeholder="admin@society.com" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} error={error} />
        <Button type="submit" loading={loading} className="w-full">{loading ? 'Sending code...' : 'Send OTP'}</Button>
        <Link to="/login" className="block text-center text-xs font-semibold text-slate-500 hover:text-slate-800">← Back to login</Link>
      </form>
    </>
  )
}
