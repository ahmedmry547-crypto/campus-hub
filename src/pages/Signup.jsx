import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { Field } from './Login'

const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4']

export default function Signup() {
  const { signUp } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [academicYear, setAcademicYear] = useState(YEARS[0])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await signUp({ name, email, password, academicYear })
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
          <h1 className="text-2xl font-bold text-parchment">{t('createAccount')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-parchment rounded-card p-5 space-y-4 shadow-lg">
          <Field label={t('name')} value={name} onChange={setName} required />
          <Field label={t('email')} type="email" value={email} onChange={setEmail} required />
          <Field label={t('password')} type="password" value={password} onChange={setPassword} required />
          <Field label={t('academicYear')}>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full rounded-xl border border-ink-100 bg-white px-4 py-2.5 text-ink-700 focus:outline-none focus:ring-2 focus:ring-brass"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </Field>
          {error && <p className="text-coral text-sm">{error}</p>}
          <button
            disabled={busy}
            className="w-full bg-ink-700 text-parchment font-semibold py-3 rounded-xl disabled:opacity-60"
          >
            {busy ? '...' : t('signup')}
          </button>
        </form>

        <p className="text-center text-parchment/70 text-sm mt-5">
          <Link to="/login" className="text-brass font-semibold">{t('login')}</Link>
        </p>
        <div className="text-center mt-6 text-xs text-ink-400 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} CampusHub. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <p className="mt-1">
            {lang === 'ar' ? (
              <>
                تطوير وبرمجة <span className="font-semibold text-brass-dark dark:text-amber-300">المهندس أحمد حسين علي</span> 💻
              </>
            ) : (
              <>
                Developed & Designed by <span className="font-semibold text-brass-dark dark:text-amber-300">Eng. Ahmed Hussein Ali</span> 💻
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
