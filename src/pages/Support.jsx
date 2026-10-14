import React, { useState, useEffect } from 'react'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { supabase } from '../lib/supabaseClient'

export default function Support() {
  const { profile, session } = useAuth()
  const { t } = useLang()

  const [form, setForm] = useState({
    name: profile?.name || '',
    comment: ''
  })
  const [status, setStatus] = useState('idle')
  const [approvedComments, setApprovedComments] = useState([])

  const appData = {
    title: 'آيات القرآن | Ayat Quran',
    subtitle: 'تطبيق إسلامي شامل بدون إعلانات - صدقة جارية',
    iconUrl: '/ayat-quran-icon.png',
    apkLink: '/ayat-quran.apk', // ضع رابط تحميل ملف الـ APK الخاص بك هنا
    features: [
      '📖 المصحف كامل بدون إنترنت، بتلوين أحكام التجويد.',
      '📌 ميزة "متابعة القراءة" للوصول لآخر آية وقفت عندها.',
      '🎧 تلاوات لعدد كبير من القراء وتعمل في الخلفية.',
      '📥 تحميل السور للاستماع بدون إنترنت.',
      '📿 أذكار الصباح والمساء ونظام مواقيت الصلاة.',
      '🌗 دعم الوضع الفاتح والداكن بالكامل.'
    ]
  }

  // جلب التعليقات المعتمدة من Supabase
  useEffect(() => {
    async function fetchComments() {
      const { data, error } = await supabase
        .from('comments')
        .select('id, user_name, comment')
        .eq('app_id', 'ayat-quran')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching comments:', error)
        return
      }
      setApprovedComments(data || [])
    }
    fetchComments()
  }, [])

  // حفظ التعليق في Supabase
  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.comment.trim()) return
    if (!session) {
      setStatus('login')
      return
    }
    setStatus('sending')

    const { error } = await supabase.from('comments').insert({
      app_id: 'ayat-quran',
      user_name: form.name || 'زائر',
      comment: form.comment
    })

    if (error) {
      console.error('Error adding comment:', error)
      setStatus('error')
      return
    }
    setStatus('sent')
    setForm((f) => ({ ...f, comment: '' }))
  }

  return (
    <div className="min-h-screen bg-parchment dark:bg-gray-900 text-ink-800 dark:text-white transition-colors pb-24">
      <TopBar title="تطبيقاتي" subtitle="استعرض وحمّل تطبيقاتنا المباشرة" />

      {/* كارت عرض التطبيق */}
      <div className="px-5 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-card p-5 shadow-sm border border-ink-50 dark:border-gray-700 text-center">

          <div className="w-24 h-24 mx-auto mb-3 rounded-2xl overflow-hidden shadow-md border border-ink-100 dark:border-gray-700">
            <img
              src={appData.iconUrl}
              alt={appData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-teal/10 dark:bg-teal-400/10 text-teal dark:text-teal-400 items-center justify-center text-3xl hidden">
              📖
            </div>
          </div>

          <h2 className="font-bold text-ink-700 dark:text-white text-lg mb-1">
            {appData.title}
          </h2>
          <p className="text-xs text-teal dark:text-teal-400 font-medium mb-4">
            {appData.subtitle}
          </p>

          <a
            href={appData.apkLink}
            download
            className="block w-full bg-teal text-white font-semibold py-3 rounded-xl shadow transition active:scale-[0.99] text-sm mb-5"
          >
            📥 للتحميل اضغط هنا (APK)
          </a>

          <div className="text-start border-t border-ink-50 dark:border-gray-700 pt-4 mb-4">
            <h3 className="font-bold text-ink-700 dark:text-white text-sm mb-2">
              مميزات التطبيق:
            </h3>
            <ul className="space-y-1.5 text-xs text-ink-400 dark:text-gray-300 leading-relaxed">
              {appData.features.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 text-start text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong>⚠️ ملحوظة مهمة عند التثبيت:</strong><br />
            قد تظهر رسالة من Google Play Protect تحذرك بأن التطبيق من مطور غير معروف. فقط اضغط على "التثبيت على أي حال".
          </div>

        </div>
      </div>

      {/* قسم كتابة التعليق وعرض التعليقات المعتمدة */}
      <div className="px-5 mt-6">
        <h2 className="font-bold text-ink-700 dark:text-white mb-3 text-sm">
          💬 آراء وتعليقات المستخدمين
        </h2>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-card p-4 shadow-sm border border-ink-50 dark:border-gray-700 space-y-3 mb-6">
          <input
            required
            placeholder={t('name') || 'الاسم'}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-xl border border-ink-100 dark:border-gray-600 bg-white dark:bg-gray-700 text-ink-800 dark:text-white placeholder-ink-300 dark:placeholder-gray-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
          />

          <textarea
            required
            rows={3}
            placeholder="اكتب رأيك أو اقتراحك للتطبيق..."
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            className="w-full rounded-xl border border-ink-100 dark:border-gray-600 bg-white dark:bg-gray-700 text-ink-800 dark:text-white placeholder-ink-300 dark:placeholder-gray-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass resize-none"
          />

          <button
            disabled={status === 'sending'}
            className="w-full bg-teal text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60"
          >
            {status === 'sending' ? '…' : 'إرسال التعليق'}
          </button>

          {status === 'sent' && (
            <p className="text-teal dark:text-teal-400 text-xs text-center">
              ✓ تم إرسال تعليقك بنجاح وسيظهر بعد مراجعة الإدارة.
            </p>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-xs text-center">
              حدث خطأ أثناء إرسال التعليق، يرجى المحاولة لاحقاً.
            </p>
          )}
          {status === 'login' && (
            <p className="text-red-500 text-xs text-center">
              لازم تسجّل دخول الأول عشان تبعت تعليق.
            </p>
          )}
        </form>

        {/* عرض التعليقات المعتمدة */}
        <div className="space-y-3">
          {approvedComments.map((c) => (
            <div key={c.id} className="bg-white dark:bg-gray-800 rounded-card p-3 shadow-sm border border-ink-50 dark:border-gray-700">
              <span className="font-bold text-xs text-teal dark:text-teal-400 block mb-1">{c.user_name}</span>
              <p className="text-xs text-ink-700 dark:text-gray-200">{c.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}