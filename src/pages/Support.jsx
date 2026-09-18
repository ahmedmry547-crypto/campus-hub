import React, { useState } from 'react'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { dummyFaqs } from '../data/dummyData'
import { submitSupportRequest } from '../lib/content'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

export default function Support() {
  const { profile } = useAuth()
  const { t, lang } = useLang()
  const [openIndex, setOpenIndex] = useState(0)
  const [form, setForm] = useState({ name: profile?.name || '', email: profile?.email || '', message: '' })
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await submitSupportRequest(form)
    setStatus(error ? 'error' : 'sent')
    if (!error) setForm((f) => ({ ...f, message: '' }))
  }

  return (
    <div className="min-h-screen bg-parchment dark:bg-gray-900 text-ink-800 dark:text-white transition-colors pb-24">
      <TopBar title={t('support')} subtitle={t('faqTitle')} />

      <div className="px-5 mt-4 space-y-2">
        {dummyFaqs.map((f, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-card border border-ink-50 dark:border-gray-700 shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              className="w-full flex items-center justify-between gap-3 p-4 text-start"
            >
              <span className="font-semibold text-ink-700 dark:text-white text-sm">{lang === 'ar' ? f.q_ar : f.q}</span>
              <span className={`shrink-0 text-teal dark:text-teal-400 transition-transform ${openIndex === i ? 'rotate-45' : ''}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            {openIndex === i && (
              <p className="px-4 pb-4 text-sm text-ink-400 dark:text-gray-300">{lang === 'ar' ? f.a_ar : f.a}</p>
            )}
          </div>
        ))}
      </div>

      <div className="px-5 mt-8">
        <h2 className="font-bold text-ink-700 dark:text-white mb-3">{t('contactUs')}</h2>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-card p-4 shadow-sm border border-ink-50 dark:border-gray-700 space-y-3">
          <input
            required
            placeholder={t('name')}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-xl border border-ink-100 dark:border-gray-600 bg-white dark:bg-gray-700 text-ink-800 dark:text-white placeholder-ink-300 dark:placeholder-gray-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
          />
          <input
            required
            type="email"
            placeholder={t('email')}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-xl border border-ink-100 dark:border-gray-600 bg-white dark:bg-gray-700 text-ink-800 dark:text-white placeholder-ink-300 dark:placeholder-gray-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
          />
          <textarea
            required
            rows={4}
            placeholder={t('yourMessage')}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full rounded-xl border border-ink-100 dark:border-gray-600 bg-white dark:bg-gray-700 text-ink-800 dark:text-white placeholder-ink-300 dark:placeholder-gray-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass resize-none"
          />
          <button
            disabled={status === 'sending'}
            className="w-full bg-teal text-white font-semibold py-3 rounded-xl disabled:opacity-60"
          >
            {status === 'sending' ? '…' : t('send')}
          </button>
          {status === 'sent' && <p className="text-teal dark:text-teal-400 text-sm text-center">✓</p>}
          {status === 'error' && <p className="text-coral text-sm text-center">Please try again.</p>}
        </form>
      </div>

      <BottomNav />
    </div>
  )
}