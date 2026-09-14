import React from 'react'
import { NavLink } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const icons = {
  home: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#C9962C' : '#3E4E76'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  ),
  suggestions: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#C9962C' : '#3E4E76'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" /><path d="M9 20h6M10 22h4" />
    </svg>
  ),
  support: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#C9962C' : '#3E4E76'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.9.4-1.4 1-1.4 1.9" /><path d="M12 17h.01" />
    </svg>
  ),
  profile: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#C9962C' : '#3E4E76'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c1.8-4 5-6 8-6s6.2 2 8 6" />
    </svg>
  )
}

export default function BottomNav() {
  const { t } = useLang()
  const items = [
    { to: '/', key: 'home', label: t('home') },
    { to: '/suggestions', key: 'suggestions', label: t('suggestions') },
    { to: '/support', key: 'support', label: t('support') },
    { to: '/profile', key: 'profile', label: t('profile') }
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-ink-100 dark:border-gray-800 pb-[env(safe-area-inset-bottom)] transition-colors">
      <ul className="flex justify-around items-stretch max-w-md mx-auto">
        {items.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
              end={item.to === '/'}
            >
              {({ isActive }) => (
                <>
                  {icons[item.key](isActive)}
                  <span className={isActive ? 'text-brass-dark dark:text-amber-300' : 'text-ink-400 dark:text-gray-400'}>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
