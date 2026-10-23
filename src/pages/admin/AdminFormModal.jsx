import { useEffect, useState } from 'react'
import { adminApi } from '../../lib/api.js'
import { Button, Field, Modal } from '../../components/ui.jsx'
import { isEmail, isPhone } from '../../lib/validate.js'
import { useToast } from '../../context/ToastContext.jsx'

const EMPTY = { first_name: '', last_name: '', email: '', number: '', password: '' }

// admin === null  -> create mode,   admin = {...} -> edit mode
export default function AdminFormModal({ open, admin, onClose, onSaved }) {
  const toast = useToast()
  const editing = !!admin
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setErrors({})
    setForm(admin ? { ...EMPTY, first_name: admin.first_name, last_name: admin.last_name, email: admin.email, number: admin.number } : EMPTY)
  }, [open, admin])

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setErrors({ ...errors, [k]: '' }) }

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.first_name.trim()) errs.first_name = 'First name is required'
    if (!form.last_name.trim()) errs.last_name = 'Last name is required'
    if (!isEmail(form.email)) errs.email = 'Enter a valid email'
    if (!isPhone(form.number)) errs.number = 'Enter digits only (7-15)'
    if (!editing && form.password.length < 8) errs.password = 'Use at least 8 characters'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)
    let res
    if (editing) {
      // password is never sent on edit (the API would store it un-hashed)
      res = await adminApi.update(admin._id, {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        number: form.number.trim(),
      })
    } else {
      res = await adminApi.create({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        number: form.number.trim(),
        password: form.password,
      })
    }
    setLoading(false)

    if (res.error) {
      toast.error(res.message)
      if (!editing) onSaved() // the API may have created the admin even if the e-mail failed
      return
    }
    toast.success(res.message)
    onSaved()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit admin' : 'Add new admin'}>
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First name" placeholder="Alexander" value={form.first_name} onChange={set('first_name')} error={errors.first_name} />
          <Field label="Last name" placeholder="Smith" value={form.last_name} onChange={set('last_name')} error={errors.last_name} />
        </div>
        <Field label="Email" type="email" placeholder="admin@society.com" value={form.email} onChange={set('email')} error={errors.email} disabled={editing} hint={editing ? 'Email cannot be changed' : undefined} />
        <Field label="Mobile number" inputMode="numeric" placeholder="9876543210" value={form.number} onChange={set('number')} error={errors.number} />
        {!editing && (
          <Field label="Temporary password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={set('password')} error={errors.password} hint="The login details are e-mailed to the new admin." />
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{editing ? 'Save changes' : 'Create admin'}</Button>
        </div>
      </form>
    </Modal>
  )
}
