import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'adminToken'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

// cookies (refresh token) must be sent -> withCredentials
const api = axios.create({ baseURL: BASE_URL, withCredentials: true })

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ---- automatic access-token refresh (access token lives 15 minutes) ----
let refreshing = null

function refreshAccessToken() {
  if (!refreshing) {
    refreshing = axios
      .post(`${BASE_URL}/admin/refresh-token`, {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((res) => {
        const token = res.data?.result?.accessToken
        if (res.data?.error || !token) throw new Error('refresh failed')
        setToken(token)
        return token
      })
      .finally(() => { refreshing = null })
  }
  return refreshing
}

// public endpoints must never trigger a refresh
const PUBLIC = ['/admin/login', '/admin/forgot-password', '/admin/verify-OTP', '/admin/change-password', '/admin/refresh-token']
const isPublic = (url = '') => PUBLIC.some((p) => url.endsWith(p))

async function retryAfterRefresh(config) {
  config._retry = true
  const token = await refreshAccessToken()
  config.headers.Authorization = `Bearer ${token}`
  return api(config)
}

function forceLogout() {
  clearToken()
  window.dispatchEvent(new Event('auth:logout'))
}

api.interceptors.response.use(
  async (res) => {
    // this backend answers HTTP 200 and puts the real status inside the body
    const cfg = res.config
    if (res.data?.status === 401 && !cfg._retry && !isPublic(cfg.url)) {
      try { return await retryAfterRefresh(cfg) } catch { forceLogout() }
    }
    return res
  },
  async (err) => {
    const cfg = err.config
    if (err.response?.status === 401 && cfg && !cfg._retry && !isPublic(cfg.url)) {
      try { return await retryAfterRefresh(cfg) } catch { forceLogout() }
    }
    return Promise.reject(err)
  },
)

// Every call returns the backend body: { status, error, message, result }
const unwrap = async (promise) => {
  try {
    const { data } = await promise
    return data
  } catch (err) {
    return { status: 500, error: true, message: err.response?.data?.message || 'Cannot reach the server. Please try again.' }
  }
}

export const authApi = {
  login: (email, password) => unwrap(api.post('/admin/login', { email, password })),
  forgotPassword: (email) => unwrap(api.post('/admin/forgot-password', { email })),
  verifyOtp: (email, OTP) => unwrap(api.post('/admin/verify-OTP', { email, OTP })),
  changePassword: (email, password, conf_password) =>
    unwrap(api.post('/admin/change-password', { email, password, conf_password })),
  me: () => unwrap(api.get('/admin/me')),
}

export const adminApi = {
  list: () => unwrap(api.get('/admin')),
  create: (body) => unwrap(api.post('/admin', body)),
  update: (id, body) => unwrap(api.patch(`/admin/${id}`, body)),
  toggleActive: (id) => unwrap(api.put(`/admin/${id}`)),
  remove: (id) => unwrap(api.delete(`/admin/${id}`)),
}
