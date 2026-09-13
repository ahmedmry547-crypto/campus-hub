import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function TopBar({ title, subtitle, showBack = false }) {
  const navigate = useNavigate()
  const { lang, toggleLang, isRtl } = useLang()

  return (
    <header className="sticky top-0 z-20 bg-ink-700 text-parchment px-5 pt-[calc(env(safe-area-inset-top)+18px)] pb-5 rounded-b-[24px] shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              aria-label="Back"
              className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
                className={isRtl ? '' : 'flip-x'}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate">{title}</h1>
            {subtitle && <p className="text-parchment/70 text-sm mt-0.5 truncate">{subtitle}</p>}
          </div>
        </div>
        <button
          onClick={toggleLang}
          className="shrink-0 text-xs font-semibold bg-brass text-ink-900 px-3 py-1.5 rounded-full"
        >
          {lang === 'en' ? 'AR' : 'EN'}
        </button>
      </div>
    </header>
  )
}
