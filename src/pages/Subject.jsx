import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { fetchSubject, pdfPublicUrl } from '../lib/content'
import { useLang } from '../context/LangContext'

const TABS = ['lectures', 'videos', 'notes']

function youtubeEmbedId(url) {
  const match = url?.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export default function Subject() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const [subject, setSubject] = useState(null)
  const [tab, setTab] = useState('lectures')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchSubject(id).then((s) => {
      setSubject(s)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return <div className="min-h-screen bg-parchment flex items-center justify-center text-ink-400">…</div>
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center text-ink-400 px-6 text-center">
        {t('noContent')}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-parchment pb-24">
      <TopBar
        title={lang === 'ar' ? subject.name_ar : subject.name}
        subtitle={subject.description}
        showBack
      />

      <div className="px-5">
        <div className="flex gap-6 border-b border-ink-100 mt-4">
          {TABS.map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-3 text-sm font-semibold ${tab === key ? 'text-ink-700 tab-underline' : 'text-ink-400'}`}
            >
              {t(key)}
            </button>
          ))}
        </div>

        <div className="pt-4 space-y-3">
          {tab === 'lectures' && (
            subject.lectures.length ? subject.lectures.map((l) => (
              <a
                key={l.id}
                href={l.file_url || pdfPublicUrl(l.file_path)}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-white rounded-card p-4 shadow-sm border border-ink-50"
              >
                <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink-700 truncate">{l.title}</p>
                  {l.size_label && <p className="text-xs text-ink-400">{l.size_label}</p>}
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3E6259" strokeWidth="2.2">
                  <path d="M12 3v13m0 0-4-4m4 4 4-4M5 20h14" />
                </svg>
              </a>
            )) : <EmptyState text={t('noContent')} />
          )}

          {tab === 'videos' && (
            subject.videos.length ? subject.videos.map((v) => {
              const yid = youtubeEmbedId(v.youtube_url)
              return (
                <div key={v.id} className="bg-white rounded-card overflow-hidden shadow-sm border border-ink-50">
                  {yid ? (
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${yid}`}
                        title={v.title}
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a href={v.youtube_url} target="_blank" rel="noreferrer" className="block p-4 text-teal font-semibold">
                      {t('watch')} ↗
                    </a>
                  )}
                  <p className="px-4 py-3 font-semibold text-ink-700">{v.title}</p>
                </div>
              )
            }) : <EmptyState text={t('noContent')} />
          )}

          {tab === 'notes' && (
            subject.notes.length ? subject.notes.map((n) => (
              <div key={n.id} className="bg-white rounded-card p-4 shadow-sm border border-ink-50">
                <p className="font-semibold text-ink-700 mb-1">{n.title}</p>
                <p className="text-sm text-ink-400 whitespace-pre-line">{n.content}</p>
              </div>
            )) : <EmptyState text={t('noContent')} />
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function EmptyState({ text }) {
  return <p className="text-ink-400 text-sm text-center py-10">{text}</p>
}
