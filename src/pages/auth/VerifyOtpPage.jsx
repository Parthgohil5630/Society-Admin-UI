import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { authApi } from '../../lib/api.js'
import { Button } from '../../components/ui.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const email = sessionStorage.getItem('resetEmail')

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(60)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  if (!email) return <Navigate to="/forgot-password" replace />

  const submit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return setError('Enter the 6-digit code')

    setLoading(true)
    const res = await authApi.verifyOtp(email, otp)
    setLoading(false)
    if (res.error) return setError(res.message)

    sessionStorage.setItem('otpVerified', '1')
    toast.success(res.message)
    navigate('/new-password')
  }

  const resend = async () => {
    const res = await authApi.forgotPassword(email)
    if (res.error) return toast.error(res.message)
    toast.success(res.message)
    setCooldown(60)
  }

  return (
    <>
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Verification</div>
        <h2 className="text-2xl font-bold tracking-tight">Enter the code</h2>
        <p className="text-sm text-slate-500">We sent a 6-digit code to <span className="font-semibold text-slate-800">{email}</span>. It expires in 10 minutes.</p>
      </div>

      <form onSubmit={submit} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <input
            inputMode="numeric"
            autoFocus
            maxLength={6}
            placeholder="••••••"
            value={otp}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
            className={`w-full text-center text-2xl font-bold tracking-[0.6em] py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-indigo-600/20 focus:border-indigo-600'}`}
          />
          {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
        </div>

        <Button type="submit" loading={loading} className="w-full">{loading ? 'Verifying...' : 'Verify code'}</Button>

        <div className="flex items-center justify-between text-xs">
          <Link to="/forgot-password" className="font-semibold text-slate-500 hover:text-slate-800">← Change email</Link>
          <button type="button" disabled={cooldown > 0} onClick={resend} className="font-semibold text-indigo-600 hover:text-indigo-700 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer">
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
          </button>
        </div>
      </form>
    </>
  )
}
