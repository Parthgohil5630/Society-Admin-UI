export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
export const isPhone = (v) => /^\d{7,15}$/.test(v.trim())
export const initials = (a) =>
  `${(a?.first_name || '?')[0] || ''}${(a?.last_name || '')[0] || ''}`.toUpperCase()
