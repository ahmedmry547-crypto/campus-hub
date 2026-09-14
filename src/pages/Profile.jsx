import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4']

export default function Profile() {
  const { profile, isAdmin, signOut, updateAcademicYear } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-parchment dark:bg-gray-900 dark:text-white pb-24 transition-colors">
      <TopBar title={t('profile')} />

      <div className="px-5 mt-5 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-card p-5 shadow-sm border border-ink-50 dark:border-gray-700 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-ink-700 text-parchment flex items-center justify-center text-xl font-bold">
            {profile?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-ink-700 dark:text-white truncate">{profile?.name}</p>
            <p className="text-sm text-ink-400 dark:text-gray-400 truncate">{profile?.email}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-card p-5 shadow-sm border border-ink-50 dark:border-gray-700">
          <label className="text-xs font-semibold text-ink-600 dark:text-gray-300 mb-1 block">{t('academicYear')}</label>
          <select
            value={profile?.academic_year || YEARS[0]}
            onChange={(e) => updateAcademicYear(e.target.value)}
            className="w-full rounded-xl border border-ink-100 dark:border-gray-600 bg-white dark:bg-gray-700 text-ink-800 dark:text-white px-4 py-2.5 text-sm focus:outline-none"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {isAdmin && (
          <Link
            to="/admin"
            className="block bg-brass/15 dark:bg-brass/25 text-brass-dark dark:text-amber-300 font-semibold text-center py-3 rounded-xl transition-colors"
          >
            {t('adminDashboard')} →
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="... bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
        >
          {t('logout')}
        </button>

        <Link to="/admin/login" className="block text-center text-xs text-ink-400 pt-2">
          {t('admin')}
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
