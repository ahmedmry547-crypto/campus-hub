import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, PDF_BUCKET } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../firebase'
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'

// صفحة إدارة تعليقات التطبيقات
import AdminComments from './AdminComments'

// أقسام لوحة الإدارة
const SECTIONS = [
  'content',
  'upload',
  'suggestions',
  'support',
  'donations',
  'comments'
]

const SECTION_NAMES = {
  content: 'المواد الدراسية',
  upload: 'رفع المحتوى',
  suggestions: 'الاقتراحات',
  support: 'رسائل الدعم',
  donations: 'التبرعات',
  comments: 'تعليقات التطبيقات'
}

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState('content')

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-parchment dark:bg-gray-900 dark:text-white pb-16 transition-colors"
    >
      <header className="bg-ink-700 text-parchment px-5 pt-[calc(env(safe-area-inset-top)+18px)] pb-5 rounded-b-[24px]">

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">
            ⚙️ لوحة الإدارة
          </h1>

          <button
            onClick={handleLogout}
            className="text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-full"
          >
            تسجيل الخروج
          </button>
        </div>

        {/* تبويبات الإدارة */}
        <div className="flex gap-2 overflow-x-auto mt-4 no-scrollbar">

          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${section === s
                  ? 'bg-brass text-ink-900'
                  : 'bg-white/10 text-parchment/80'
                }`}
            >
              {SECTION_NAMES[s]}
            </button>
          ))}

        </div>
      </header>

      {/* محتوى التبويبات */}
      <div className="px-5 mt-5">

        {section === 'content' && <ContentManager />}

        {section === 'upload' && <UploadManager />}

        {section === 'suggestions' && (
          <ListViewer table="suggestions" />
        )}

        {section === 'support' && (
          <ListViewer table="support_requests" />
        )}

        {section === 'donations' && <DonationsManager />}

        {/* التبويب الجديد */}
        {section === 'comments' && <AdminComments />}

      </div>
    </div>
  )
}


// ==========================================
// إدارة السنوات الدراسية والمواد
// ==========================================

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

    if (data?.[0]?.id) {
      setTargetYear((t) => t || data[0].id)
    }
  }

  useEffect(() => {
    loadYears()
  }, [])

  async function addYear(e) {
    e.preventDefault()

    const order_index = (years.length || 0) + 1

    const { error } = await supabase
      .from('academic_years')
      .insert({
        name: yearName,
        name_ar: yearNameAr,
        order_index
      })

    setMsg(error ? error.message : 'تمت إضافة السنة بنجاح.')

    if (!error) {
      setYearName('')
      setYearNameAr('')
      loadYears()
    }
  }

  async function addSubject(e) {
    e.preventDefault()

    if (!targetYear) return

    const { error } = await supabase
      .from('subjects')
      .insert({
        academic_year_id: targetYear,
        name: subjectName,
        name_ar: subjectNameAr,
        description: subjectDesc,
        order_index: 0
      })

    setMsg(error ? error.message : 'تمت إضافة المادة بنجاح.')

    if (!error) {
      setSubjectName('')
      setSubjectNameAr('')
      setSubjectDesc('')
      loadYears()
    }
  }

  return (
    <div className="space-y-5">

      <Card title="إضافة سنة دراسية">
        <form onSubmit={addYear} className="space-y-2">

          <Input
            placeholder="Name (e.g. Year 1)"
            value={yearName}
            onChange={setYearName}
            required
          />

          <Input
            placeholder="اسم السنة بالعربية"
            value={yearNameAr}
            onChange={setYearNameAr}
            dir="rtl"
          />

          <SubmitButton>إضافة السنة</SubmitButton>

        </form>
      </Card>

      <Card title="إضافة مادة دراسية">
        <form onSubmit={addSubject} className="space-y-2">

          <Select
            value={targetYear}
            onChange={setTargetYear}
            required
          >
            {years.map((y) => (
              <option key={y.id} value={y.id}>
                {y.name}
              </option>
            ))}
          </Select>

          <Input
            placeholder="Subject name"
            value={subjectName}
            onChange={setSubjectName}
            required
          />

          <Input
            placeholder="اسم المادة بالعربية"
            value={subjectNameAr}
            onChange={setSubjectNameAr}
          />

          <Input
            placeholder="وصف مختصر للمادة"
            value={subjectDesc}
            onChange={setSubjectDesc}
          />

          <SubmitButton>إضافة المادة</SubmitButton>

        </form>
      </Card>

      {msg && (
        <p className="text-sm text-teal">{msg}</p>
      )}

      <Card title="السنوات والمواد الحالية">

        <div className="space-y-3">

          {years.map((y) => (
            <div key={y.id} className="border-b dark:border-gray-700 pb-2">

              <div className="flex items-center justify-between">

                <p className="font-semibold text-ink-700 dark:text-white text-sm">
                  {y.name}
                </p>

                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(`هل أنت متأكد من حذف "${y.name}"؟`)) {
                      await supabase
                        .from('academic_years')
                        .delete()
                        .eq('id', y.id)

                      window.location.reload()
                    }
                  }}
                  className="text-xs text-red-500 font-bold px-2 py-1 rounded bg-red-50"
                >
                  حذف السنة
                </button>

              </div>

              <ul className="text-sm text-ink-400 dark:text-gray-300 ps-4 mt-2 space-y-2">

                {(y.subjects || []).map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between"
                  >

                    <span>{s.name}</span>

                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm(`هل أنت متأكد من حذف المادة "${s.name}"؟`)) {
                          await supabase
                            .from('subjects')
                            .delete()
                            .eq('id', s.id)

                          window.location.reload()
                        }
                      }}
                      className="text-xs text-red-400 hover:text-red-600 ms-2"
                    >
                      حذف
                    </button>

                  </li>
                ))}

              </ul>

            </div>
          ))}

        </div>

      </Card>

    </div>
  )
}


// ==========================================
// إدارة رفع المحاضرات والفيديوهات والملاحظات
// ==========================================

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
    supabase
      .from('subjects')
      .select('id, name')
      .then(({ data }) => {
        setSubjects(data || [])

        if (data?.[0]?.id) {
          setSubjectId(data[0].id)
        }
      })
  }, [])

  async function uploadPdf(e) {
    e.preventDefault()

    if (!file || !subjectId) return

    setBusy(true)

    const path = `${subjectId}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from(PDF_BUCKET)
      .upload(path, file)

    if (uploadError) {
      setMsg(uploadError.message)
      setBusy(false)
      return
    }

    const { error } = await supabase
      .from('lectures')
      .insert({
        subject_id: subjectId,
        title: pdfTitle || file.name,
        file_path: path
      })

    setBusy(false)

    setMsg(error ? error.message : 'تم رفع المحاضرة بنجاح.')

    if (!error) {
      setPdfTitle('')
      setFile(null)
    }
  }

  async function addVideo(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('videos')
      .insert({
        subject_id: subjectId,
        title: videoTitle,
        youtube_url: videoUrl
      })

    setMsg(error ? error.message : 'تمت إضافة الفيديو.')

    if (!error) {
      setVideoTitle('')
      setVideoUrl('')
    }
  }

  async function addNote(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('notes')
      .insert({
        subject_id: subjectId,
        title: noteTitle,
        content: noteContent
      })

    setMsg(error ? error.message : 'تمت إضافة الملاحظة.')

    if (!error) {
      setNoteTitle('')
      setNoteContent('')
    }
  }

  return (
    <div className="space-y-5">

      <Card title="اختيار المادة">

        <Select
          value={subjectId}
          onChange={setSubjectId}
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>

      </Card>

      <Card title="رفع محاضرة PDF">

        <form onSubmit={uploadPdf} className="space-y-2">

          <Input
            placeholder="عنوان المحاضرة (اختياري)"
            value={pdfTitle}
            onChange={setPdfTitle}
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm"
          />

          <SubmitButton disabled={busy}>
            {busy ? 'جاري الرفع...' : 'رفع المحاضرة'}
          </SubmitButton>

        </form>

      </Card>

      <Card title="إضافة فيديو YouTube">

        <form onSubmit={addVideo} className="space-y-2">

          <Input
            placeholder="عنوان الفيديو"
            value={videoTitle}
            onChange={setVideoTitle}
            required
          />

          <Input
            placeholder="رابط YouTube"
            value={videoUrl}
            onChange={setVideoUrl}
            required
          />

          <SubmitButton>إضافة الفيديو</SubmitButton>

        </form>

      </Card>

      <Card title="إضافة ملاحظة">

        <form onSubmit={addNote} className="space-y-2">

          <Input
            placeholder="عنوان الملاحظة"
            value={noteTitle}
            onChange={setNoteTitle}
            required
          />

          <textarea
            placeholder="المحتوى"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-ink-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm resize-none"
          />

          <SubmitButton>إضافة الملاحظة</SubmitButton>

        </form>

      </Card>

      {msg && (
        <p className="text-sm text-teal">{msg}</p>
      )}

    </div>
  )
}


// ==========================================
// إدارة التبرعات - Firebase
// ==========================================

function DonationsManager() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchDonations() {
    try {
      const querySnapshot = await getDocs(
        collection(db, 'donations')
      )

      const list = querySnapshot.docs.map(item => ({
        id: item.id,
        ...item.data()
      }))

      setDonations(list)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDonations()
  }, [])

  async function handleStatus(id, newStatus) {
    try {
      await updateDoc(doc(db, 'donations', id), {
        status: newStatus
      })

      fetchDonations()

    } catch (err) {
      console.error(err)
      alert('حدث خطأ أثناء تحديث الحالة')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return

    try {
      await deleteDoc(doc(db, 'donations', id))
      fetchDonations()

    } catch (err) {
      console.error(err)
      alert('حدث خطأ أثناء الحذف')
    }
  }

  if (loading) {
    return (
      <p className="text-ink-400 text-sm">
        جاري تحميل التبرعات...
      </p>
    )
  }

  if (!donations.length) {
    return (
      <p className="text-ink-400 text-sm">
        لا توجد طلبات تبرع حتى الآن.
      </p>
    )
  }

  return (
    <div className="space-y-3">

      {donations.map((d) => (
        <div
          key={d.id}
          className="bg-white dark:bg-gray-800 rounded-card p-4 shadow-sm border border-ink-50 dark:border-gray-700 flex items-center justify-between gap-3"
        >

          <div>

            <div className="flex items-center gap-2 mb-1 flex-wrap">

              <span className="font-bold text-ink-700 dark:text-white text-sm">
                {d.name}
              </span>

              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-200">
                المبلغ: {d.amount} ج.م
              </span>

            </div>

            <p className="text-xs text-ink-400 dark:text-gray-300">
              الحالة:{' '}

              <span className={`font-semibold ${d.status === 'approved'
                  ? 'text-green-600'
                  : 'text-amber-600'
                }`}>
                {d.status === 'approved' ? 'مقبول' : 'معلق'}
              </span>

            </p>

          </div>

          <div className="flex gap-2 shrink-0">

            {d.status !== 'approved' ? (

              <button
                onClick={() => handleStatus(d.id, 'approved')}
                className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold"
              >
                موافقة
              </button>

            ) : (

              <button
                onClick={() => handleStatus(d.id, 'pending')}
                className="bg-amber-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold"
              >
                إلغاء
              </button>

            )}

            <button
              onClick={() => handleDelete(d.id)}
              className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold"
            >
              حذف
            </button>

          </div>

        </div>
      ))}

    </div>
  )
}


// ==========================================
// عرض الاقتراحات ورسائل الدعم - Supabase
// ==========================================

function ListViewer({ table }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRows(data || [])
        setLoading(false)
      })
  }, [table])

  if (loading) {
    return (
      <p className="text-ink-400 text-sm">
        جاري التحميل...
      </p>
    )
  }

  if (!rows.length) {
    return (
      <p className="text-ink-400 text-sm">
        لا توجد رسائل حتى الآن.
      </p>
    )
  }

  return (
    <div className="space-y-3">

      {rows.map((r) => (

        <div
          key={r.id}
          className="bg-white dark:bg-gray-800 rounded-card p-4 shadow-sm border border-ink-50 dark:border-gray-700"
        >

          <div className="flex justify-between text-xs text-ink-400 dark:text-gray-300 mb-1 gap-2">

            <span>
              {r.name || 'Anonymous'} · {r.email}
            </span>

            <span>
              {new Date(r.created_at).toLocaleDateString()}
            </span>

          </div>

          <p className="text-sm text-ink-700 dark:text-gray-200">
            {r.message}
          </p>

        </div>

      ))}

    </div>
  )
}


// ==========================================
// مكونات التصميم المشتركة
// ==========================================

function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-card p-4 shadow-sm border border-ink-50 dark:border-gray-700">

      <p className="font-bold text-ink-700 dark:text-white text-sm mb-3">
        {title}
      </p>

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
      className="w-full rounded-xl border border-ink-100 dark:border-gray-600 bg-white dark:bg-gray-700 text-ink-800 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
    />
  )
}

function Select({ value, onChange, children, ...props }) {
  return (
    <select
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-ink-100 dark:border-gray-600 bg-white dark:bg-gray-700 text-ink-800 dark:text-white px-3 py-2 text-sm"
    >
      {children}
    </select>
  )
}

function SubmitButton({ children, disabled }) {
  return (
    <button
      disabled={disabled}
      className="w-full bg-ink-700 text-parchment font-semibold py-2.5 rounded-xl disabled:opacity-60"
    >
      {children}
    </button>
  )
}