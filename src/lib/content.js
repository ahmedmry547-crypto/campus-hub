import { supabase, PDF_BUCKET } from './supabaseClient'
import { dummyYears } from '../data/dummyData'

const TTL = 7 * 24 * 60 * 60 * 1000 // 7 أيام
const PREFIX = 'ch2:' // غيرته عشان الكاش الغلط القديم يتتجاهل لوحده
const memory = new Map()
const inflight = new Map()

function readCache(key) {
  const m = memory.get(key)
  if (m && Date.now() - m.t < TTL) return m.v
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw) {
      const { t, v } = JSON.parse(raw)
      if (Date.now() - t < TTL) {
        memory.set(key, { t, v })
        return v
      }
    }
  } catch { }
  return null
}

function writeCache(key, v) {
  const entry = { t: Date.now(), v }
  memory.set(key, entry)
  try { localStorage.setItem(PREFIX + key, JSON.stringify(entry)) } catch { }
}

// loader لازم يرجّع { value, ok } — الكاش بيتحفظ بس لو ok = true
async function cached(key, loader) {
  const hit = readCache(key)
  if (hit) return hit
  if (inflight.has(key)) return inflight.get(key)

  const p = loader()
    .then(({ value, ok }) => {
      if (ok && value) writeCache(key, value)
      return value
    })
    .finally(() => inflight.delete(key))

  inflight.set(key, p)
  return p
}

export async function fetchYears() {
  const real = await cached('years', async () => {
    const { data, error } = await supabase
      .from('academic_years')
      .select('id, name, name_ar, order_index, subjects(id, name, name_ar, description, order_index)')
      .order('order_index', { ascending: true })

    if (error || !data || data.length === 0) return { value: null, ok: false }

    const value = data.map((y) => ({
      ...y,
      subjects: [...(y.subjects || [])].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    }))
    return { value, ok: true }
  })
  return real || dummyYears
}

export async function fetchSubject(subjectId) {
  const real = await cached('subject:' + subjectId, async () => {
    const { data: subject, error } = await supabase
      .from('subjects')
      .select('id, name, name_ar, description, academic_year_id')
      .eq('id', subjectId)
      .single()

    if (error || !subject) return { value: null, ok: false }

    const [lecturesRes, videosRes, notesRes] = await Promise.all([
      supabase.from('lectures').select('*').eq('subject_id', subjectId).order('created_at', { ascending: false }),
      supabase.from('videos').select('*').eq('subject_id', subjectId).order('created_at', { ascending: false }),
      supabase.from('notes').select('*').eq('subject_id', subjectId).order('created_at', { ascending: false })
    ])

    const failed = lecturesRes.error || videosRes.error || notesRes.error
    if (failed) console.error('fetchSubject error:', lecturesRes.error, videosRes.error, notesRes.error)

    const value = {
      ...subject,
      lectures: lecturesRes.data || [],
      videos: videosRes.data || [],
      notes: notesRes.data || []
    }

    // لو أي استعلام فشل، نعرض اللي وصل بس من غير ما نحفظه في الكاش
    return { value, ok: !failed }
  })

  if (real) return real

  for (const y of dummyYears) {
    const found = y.subjects.find((s) => s.id === subjectId)
    if (found) return found
  }
  return null
}

export function pdfPublicUrl(filePath) {
  if (!filePath) return '#'
  const { data } = supabase.storage.from(PDF_BUCKET).getPublicUrl(filePath)
  return data?.publicUrl || '#'
}

export async function submitSuggestion({ userId, name, email, message }) {
  return supabase.from('suggestions').insert({ user_id: userId, name, email, message })
}

export async function submitSupportRequest({ name, email, message }) {
  return supabase.from('support_requests').insert({ name, email, message })
}