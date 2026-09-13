import React, { useState } from 'react'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { submitSuggestion } from '../lib/content'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

export default function Suggestions() {
  const { user, profile } = useAuth()
  const { t } = useLang()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await submitSuggestion({
      userId: user?.id,
      name: profile?.name,
      email: profile?.email,
      message
    })
    setStatus(error ? 'error' : 'sent')
    if (!error) setMessage('')
  }

  return (
    <div className="min-h-screen bg-parchment pb-24">
      <TopBar title={t('suggestions')} subtitle={t('suggestionTitle')} />

      <div className="px-5 mt-5">
        <div className="bg-white rounded-card p-5 shadow-sm border border-ink-50">
          <div className="w-11 h-11 rounded-2xl bg-brass/15 text-brass-dark flex items-center justify-center mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" /><path d="M9 20h6" />
            </svg>
          </div>
          <p className="text-sm text-ink-400 mb-4">{t('suggestionSub')}</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('yourMessage')}
              className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass resize-none"
            />
            <button
              disabled={status === 'sending'}
              className="w-full bg-ink-700 text-parchment font-semibold py-3 rounded-xl disabled:opacity-60"
            >
              {status === 'sending' ? '…' : t('submit')}
            </button>
            {status === 'sent' && <p className="text-teal text-sm text-center">✓ Thank you!</p>}
            {status === 'error' && <p className="text-coral text-sm text-center">Please try again.</p>}
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
