import { createContext, useContext, useEffect, useState } from 'react'
import { authApi, clearToken, getToken, setToken } from '../lib/api.js'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(!!getToken())

  const logout = () => {
    clearToken()
    setAdmin(null)
  }

  // restore session on page load
  useEffect(() => {
    if (!getToken()) return
    let alive = true
    authApi.me().then((res) => {
      if (!alive) return
      if (res.error) clearToken()
      else setAdmin(res.result)
      setLoading(false)
    })
    return () => { alive = false }
  }, [])

  // api.js fires this when the refresh token is also dead
  useEffect(() => {
    const onLogout = () => setAdmin(null)
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  // returns the backend response so the page can show the message
  const login = async (email, password) => {
    const res = await authApi.login(email, password)
    if (res.error) return res
    setToken(res.result)
    const me = await authApi.me()
    if (me.error) {
      clearToken()
      return me
    }
    setAdmin(me.result)
    return res
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthed: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}
