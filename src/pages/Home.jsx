import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { fetchYears } from '../lib/content'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

export default function Home() {
  const { profile } = useAuth()
  const { t, lang } = useLang()
  const [years, setYears] = useState([])
  const [activeYear, setActiveYear] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchYears().then((data) => {
      setYears(data)
      const preferred = data.find((y) => y.name === profile?.academic_year)
      setActiveYear((preferred || data[0])?.id || null)
      setLoading(false)
    })
  }, [profile?.academic_year])

  const current = years.find((y) => y.id === activeYear)

  return (
    <div className="min-h-screen bg-parchment pb-24">
      <TopBar
        title={profile?.name ? `${lang === 'ar' ? 'أهلاً' : 'Hi'}, ${profile.name.split(' ')[0]}` : 'Campus Hub'}
        subtitle={t('years')}
      />

      <div className="px-5 -mt-2">
        <div className="flex gap-2 overflow-x-auto py-4 no-scrollbar">
          {years.map((y) => (
            <button
              key={y.id}
              onClick={() => setActiveYear(y.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${activeYear === y.id
                ? 'bg-ink-700 text-parchment border-ink-700'
                : 'bg-white text-ink-600 border-ink-100'
                }`}
            >
              {lang === 'ar' ? y.name_ar : y.name}
            </button>
          ))}
        </div>

        {loading && <p className="text-ink-400 text-sm py-8 text-center">…</p>}

        <div className="space-y-3">
          {current?.subjects?.map((s) => (
            <Link
              key={s.id}
              to={`/subject/${s.id}`}
              className="block bg-white rounded-card p-4 shadow-sm border border-ink-50 active:scale-[0.99] transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-ink-700">{lang === 'ar' ? s.name_ar : s.name}</h3>
                  {s.description && (
                    <p className="text-sm text-ink-400 mt-1 line-clamp-2">{s.description}</p>
                  )}
                </div>
                <div className="shrink-0 w-9 h-9 rounded-full bg-parchment-dim flex items-center justify-center text-teal">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="flip-x">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}

          {current && current.subjects?.length === 0 && (
            <p className="text-ink-400 text-sm text-center py-10">{t('noContent')}</p>
          )}
        </div>
      </div>
      <div className="w-full my-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-800 mb-3 text-right">
          مكتبة كافة مواد الكلية (Google Drive)
        </h2>

        <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200">
          <iframe
            src="https://drive.google.com/embeddedfolderview?id=1DSIxbXTzASZ6YEpcovs4CsI_nNXXaAa4#list"
            className="w-full h-full border-0"
            title="Google Drive Materials"
          ></iframe>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
