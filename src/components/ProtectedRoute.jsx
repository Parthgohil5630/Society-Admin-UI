import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Spinner } from './ui.jsx'

export default function ProtectedRoute() {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-600">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
