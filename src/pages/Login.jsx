import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

export default function Login() {
  const { signIn } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await signIn({ email, password })
    setBusy(false)
    if (error) setError(error.message)
    else navigate('/')
  }

  return (
    <div className="min-h-screen bg-ink-700 flex flex-col justify-center px-6 py-10">
      <div className="max-w-sm w-full mx-auto">
        <div className="mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brass mx-auto mb-4 flex items-center justify-center text-ink-900 font-extrabold text-2xl">
            CH
          </div>
          <h1 className="text-2xl font-bold text-parchment">{t('welcome')}</h1>
          <p className="text-parchment/60 text-sm mt-1">Campus Hub</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-parchment rounded-card p-5 space-y-4 shadow-lg">
          <Field label={t('email')} type="email" value={email} onChange={setEmail} required />
          <Field label={t('password')} type="password" value={password} onChange={setPassword} required />
          {error && <p className="text-coral text-sm">{error}</p>}
          <button
            disabled={busy}
            className="w-full bg-ink-700 text-parchment font-semibold py-3 rounded-xl disabled:opacity-60"
          >
            {busy ? '...' : t('login')}
          </button>
        </form>

        <p className="text-center text-parchment/70 text-sm mt-5">
          {t('createAccount')}{' '}
          <Link to="/signup" className="text-brass font-semibold">{t('signup')}</Link>
        </p>
      </div>
    </div>
  )
}

export function Field({ label, type = 'text', value, onChange, required, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-600 mb-1 block">{label}</span>
      {children || (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full rounded-xl border border-ink-100 bg-white px-4 py-2.5 text-ink-700 focus:outline-none focus:ring-2 focus:ring-brass"
        />
      )}
    </label>
  )
}
