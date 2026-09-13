import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, PDF_BUCKET } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

const SECTIONS = ['content', 'upload', 'suggestions', 'support']

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState('content')

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-parchment pb-16">
      <header className="bg-ink-700 text-parchment px-5 pt-[calc(env(safe-area-inset-top)+18px)] pb-5 rounded-b-[24px]">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin dashboard</h1>
          <button onClick={handleLogout} className="text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-full">
            Log out
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto mt-4 no-scrollbar">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                section === s ? 'bg-brass text-ink-900' : 'bg-white/10 text-parchment/80'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 mt-5">
        {section === 'content' && <ContentManager />}
        {section === 'upload' && <UploadManager />}
        {section === 'suggestions' && <ListViewer table="suggestions" />}
        {section === 'support' && <ListViewer table="support_requests" />}
      </div>
    </div>
  )
}

// ---- Manage academic years + subjects ----
function ContentManager() {
  const [years, setYears] = useState([])
  const [yearName, setYearName] = useState('')
  const [yearNameAr, setYearNameAr] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [subjectNameAr, setSubjectNameAr] = useState('')
  const [subjectDesc, setSubjectDesc] = useState('')
  const [targetYear, setTargetYear] = useState('')
  const [msg, setMsg] = useState('')

  async function loadYears() {
    const { data } = await supabase
      .from('academic_years')
      .select('id, name, name_ar, subjects(id, name)')
      .order('order_index')
    setYears(data || [])
    if (data?.[0]?.id) setTargetYear((t) => t || data[0].id)
  }

  useEffect(() => { loadYears() }, [])

  async function addYear(e) {
    e.preventDefault()
    const order_index = (years.length || 0) + 1
    const { error } = await supabase.from('academic_years').insert({ name: yearName, name_ar: yearNameAr, order_index })
    setMsg(error ? error.message : 'Year added.')
    if (!error) { setYearName(''); setYearNameAr(''); loadYears() }
  }

  async function addSubject(e) {
    e.preventDefault()
    if (!targetYear) return
    const { error } = await supabase.from('subjects').insert({
      academic_year_id: targetYear,
      name: subjectName,
      name_ar: subjectNameAr,
      description: subjectDesc,
      order_index: 0
    })
    setMsg(error ? error.message : 'Subject added.')
    if (!error) { setSubjectName(''); setSubjectNameAr(''); setSubjectDesc(''); loadYears() }
  }

  return (
    <div className="space-y-5">
      <Card title="Add academic year">
        <form onSubmit={addYear} className="space-y-2">
          <Input placeholder="Name (e.g. Year 1)" value={yearName} onChange={setYearName} required />
          <Input placeholder="Arabic name (e.g. السنة الأولى)" value={yearNameAr} onChange={setYearNameAr} dir="rtl" />
          <SubmitButton>Add year</SubmitButton>
        </form>
      </Card>

      <Card title="Add subject">
        <form onSubmit={addSubject} className="space-y-2">
          <Select value={targetYear} onChange={setTargetYear} required>
            {years.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
          </Select>
          <Input placeholder="Subject name" value={subjectName} onChange={setSubjectName} required />
          <Input placeholder="Arabic name" value={subjectNameAr} onChange={setSubjectNameAr} dir="rtl" />
          <Input placeholder="Short description" value={subjectDesc} onChange={setSubjectDesc} />
          <SubmitButton>Add subject</SubmitButton>
        </form>
      </Card>

      {msg && <p className="text-sm text-teal">{msg}</p>}

      <Card title="Current structure">
        <div className="space-y-3">
          {years.map((y) => (
            <div key={y.id}>
              <p className="font-semibold text-ink-700 text-sm">{y.name}</p>
              <ul className="text-sm text-ink-400 ps-4 list-disc">
                {(y.subjects || []).map((s) => <li key={s.id}>{s.name}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ---- Upload PDFs, videos, notes to a subject ----
function UploadManager() {
  const [subjects, setSubjects] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [pdfTitle, setPdfTitle] = useState('')
  const [file, setFile] = useState(null)
  const [videoTitle, setVideoTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.from('subjects').select('id, name').then(({ data }) => {
      setSubjects(data || [])
      if (data?.[0]?.id) setSubjectId(data[0].id)
    })
  }, [])

  async function uploadPdf(e) {
    e.preventDefault()
    if (!file || !subjectId) return
    setBusy(true)
    const path = `${subjectId}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from(PDF_BUCKET).upload(path, file)
    if (uploadError) {
      setMsg(uploadError.message)
      setBusy(false)
      return
    }
    const { error } = await supabase.from('lectures').insert({
      subject_id: subjectId,
      title: pdfTitle || file.name,
      file_path: path
    })
    setBusy(false)
    setMsg(error ? error.message : 'PDF uploaded.')
    if (!error) { setPdfTitle(''); setFile(null) }
  }

  async function addVideo(e) {
    e.preventDefault()
    const { error } = await supabase.from('videos').insert({ subject_id: subjectId, title: videoTitle, youtube_url: videoUrl })
    setMsg(error ? error.message : 'Video added.')
    if (!error) { setVideoTitle(''); setVideoUrl('') }
  }

  async function addNote(e) {
    e.preventDefault()
    const { error } = await supabase.from('notes').insert({ subject_id: subjectId, title: noteTitle, content: noteContent })
    setMsg(error ? error.message : 'Note added.')
    if (!error) { setNoteTitle(''); setNoteContent('') }
  }

  return (
    <div className="space-y-5">
      <Card title="Subject">
        <Select value={subjectId} onChange={setSubjectId}>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
      </Card>

      <Card title="Upload lecture PDF">
        <form onSubmit={uploadPdf} className="space-y-2">
          <Input placeholder="Title (optional)" value={pdfTitle} onChange={setPdfTitle} />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm"
          />
          <SubmitButton disabled={busy}>{busy ? 'Uploading…' : 'Upload PDF'}</SubmitButton>
        </form>
      </Card>

      <Card title="Add YouTube video">
        <form onSubmit={addVideo} className="space-y-2">
          <Input placeholder="Video title" value={videoTitle} onChange={setVideoTitle} required />
          <Input placeholder="YouTube URL" value={videoUrl} onChange={setVideoUrl} required />
          <SubmitButton>Add video</SubmitButton>
        </form>
      </Card>

      <Card title="Add note">
        <form onSubmit={addNote} className="space-y-2">
          <Input placeholder="Note title" value={noteTitle} onChange={setNoteTitle} required />
          <textarea
            placeholder="Content"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-ink-100 px-3 py-2 text-sm resize-none"
          />
          <SubmitButton>Add note</SubmitButton>
        </form>
      </Card>

      {msg && <p className="text-sm text-teal">{msg}</p>}
    </div>
  )
}

// ---- Suggestions / Support list viewer ----
function ListViewer({ table }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from(table).select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setRows(data || [])
      setLoading(false)
    })
  }, [table])

  if (loading) return <p className="text-ink-400 text-sm">…</p>
  if (!rows.length) return <p className="text-ink-400 text-sm">Nothing submitted yet.</p>

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.id} className="bg-white rounded-card p-4 shadow-sm border border-ink-50">
          <div className="flex justify-between text-xs text-ink-400 mb-1">
            <span>{r.name || 'Anonymous'} · {r.email}</span>
            <span>{new Date(r.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-ink-700">{r.message}</p>
        </div>
      ))}
    </div>
  )
}

// ---- shared bits ----
function Card({ title, children }) {
  return (
    <div className="bg-white rounded-card p-4 shadow-sm border border-ink-50">
      <p className="font-bold text-ink-700 text-sm mb-3">{title}</p>
      {children}
    </div>
  )
}
function Input({ value, onChange, ...props }) {
  return (
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-ink-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
    />
  )
}
function Select({ value, onChange, children, ...props }) {
  return (
    <select
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-ink-100 px-3 py-2 text-sm"
    >
      {children}
    </select>
  )
}
function SubmitButton({ children, disabled }) {
  return (
    <button disabled={disabled} className="w-full bg-ink-700 text-parchment font-semibold py-2.5 rounded-xl disabled:opacity-60">
      {children}
    </button>
  )
}
