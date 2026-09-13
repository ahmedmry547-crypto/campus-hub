import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { signIn, isAdmin } = useAuth()
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
    if (error) {
      setError(error.message)
      return
    }
    // isAdmin flips async once the profile reloads; a short delay then check
    setTimeout(() => {
      navigate('/admin')
    }, 400)
  }

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="max-w-sm w-full bg-ink-700 rounded-card p-6 space-y-4">
        <h1 className="text-parchment font-bold text-xl mb-2">Admin sign in</h1>
        <input
          required
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl px-4 py-2.5 text-sm bg-white/10 text-parchment placeholder-parchment/40 focus:outline-none focus:ring-2 focus:ring-brass"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl px-4 py-2.5 text-sm bg-white/10 text-parchment placeholder-parchment/40 focus:outline-none focus:ring-2 focus:ring-brass"
        />
        {error && <p className="text-coral text-sm">{error}</p>}
        <button disabled={busy} className="w-full bg-brass text-ink-900 font-semibold py-3 rounded-xl">
          {busy ? '…' : 'Sign in'}
        </button>
        {!isAdmin && (
          <p className="text-parchment/40 text-xs leading-relaxed">
            Admin accounts are regular users with <code>is_admin = true</code> set on their profile row
            (see supabase/schema.sql).
          </p>
        )}
      </form>
    </div>
  )
}
