import React from 'react'
import { NavLink } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const icons = {
  home: (active) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#C9962C' : '#3E4E76'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  ),

  suggestions: (active) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#C9962C' : '#3E4E76'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
      <path d="M9 20h6M10 22h4" />
    </svg>
  ),

  // أيقونة تطبيقاتي (هاتف ذكي)
  support: (active) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#C9962C' : '#3E4E76'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),

  supporters: (active) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#C9962C' : '#3E4E76'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),

  profile: (active) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#C9962C' : '#3E4E76'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.8-4 5-6 8-6s6.2 2 8 6" />
    </svg>
  )
}

export default function BottomNav() {
  const { t } = useLang()

  const items = [
    {
      to: '/',
      key: 'home',
      label: t('home') || 'الرئيسية'
    },
    {
      to: '/suggestions',
      key: 'suggestions',
      label: t('suggestions') || 'الاقتراحات'
    },
    {
      to: '/support',
      key: 'support',
      label: 'تطبيقاتي' // تم التغيير هنا من "الدعم" إلى "تطبيقاتي"
    },
    {
      to: '/supporters',
      key: 'supporters',
      label: 'الداعمين'
    },
    {
      to: '/profile',
      key: 'profile',
      label: t('profile') || 'الملف الشخصي'
    }
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

                  <span
                    className={
                      isActive
                        ? 'text-brass-dark dark:text-amber-300 font-bold'
                        : 'text-ink-400 dark:text-gray-400'
                    }
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}