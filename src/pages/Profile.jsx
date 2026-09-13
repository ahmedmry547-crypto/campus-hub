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
    <div className="min-h-screen bg-parchment pb-24">
      <TopBar title={t('profile')} />

      <div className="px-5 mt-5 space-y-4">
        <div className="bg-white rounded-card p-5 shadow-sm border border-ink-50 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-ink-700 text-parchment flex items-center justify-center text-xl font-bold">
            {profile?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-ink-700 truncate">{profile?.name}</p>
            <p className="text-sm text-ink-400 truncate">{profile?.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-card p-5 shadow-sm border border-ink-50">
          <label className="text-xs font-semibold text-ink-600 mb-1 block">{t('academicYear')}</label>
          <select
            value={profile?.academic_year || YEARS[0]}
            onChange={(e) => updateAcademicYear(e.target.value)}
            className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {isAdmin && (
          <Link
            to="/admin"
            className="block bg-brass/15 text-brass-dark font-semibold text-center py-3 rounded-xl"
          >
            {t('adminDashboard')} →
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-white border border-coral/30 text-coral font-semibold py-3 rounded-xl"
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
