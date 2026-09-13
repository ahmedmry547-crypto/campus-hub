import { supabase, PDF_BUCKET } from './supabaseClient'
import { dummyYears } from '../data/dummyData'

// Fetch all academic years with nested subjects (lectures/videos/notes counts only,
// full lists are loaded per-subject on the subject page for speed).
export async function fetchYears() {
  const { data, error } = await supabase
    .from('academic_years')
    .select('id, name, name_ar, order_index, subjects(id, name, name_ar, description, order_index)')
    .order('order_index', { ascending: true })

  if (error || !data || data.length === 0) {
    return dummyYears
  }

  return data.map((y) => ({
    ...y,
    subjects: [...(y.subjects || [])].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
  }))
}

export async function fetchSubject(subjectId) {
  // Try Supabase first
  const { data: subject, error } = await supabase
    .from('subjects')
    .select('id, name, name_ar, description, academic_year_id')
    .eq('id', subjectId)
    .single()

  if (error || !subject) {
    for (const y of dummyYears) {
      const found = y.subjects.find((s) => s.id === subjectId)
      if (found) return found
    }
    return null
  }

  const [{ data: lectures }, { data: videos }, { data: notes }] = await Promise.all([
    supabase.from('lectures').select('*').eq('subject_id', subjectId).order('created_at', { ascending: false }),
    supabase.from('videos').select('*').eq('subject_id', subjectId).order('created_at', { ascending: false }),
    supabase.from('notes').select('*').eq('subject_id', subjectId).order('created_at', { ascending: false })
  ])

  return { ...subject, lectures: lectures || [], videos: videos || [], notes: notes || [] }
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
