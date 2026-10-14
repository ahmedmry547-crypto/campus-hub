import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminComments() {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [busyId, setBusyId] = useState(null)

    const load = useCallback(async () => {
        const { data, error } = await supabase
            .from('comments')
            .select('id, created_at, app_id, user_name, comment, is_approved')
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
            setError('تعذر تحميل التعليقات. تأكد إنك مسجل دخول كأدمن.')
        } else {
            setComments(data || [])
            setError('')
        }
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    async function handleApprove(id) {
        setBusyId(id)
        setError('')
        const { data, error } = await supabase
            .from('comments')
            .update({ is_approved: true })
            .eq('id', id)
            .select()

        if (error || !data?.length) {
            console.error(error)
            setError('حدث خطأ أثناء الموافقة على التعليق.')
        }
        await load()
        setBusyId(null)
    }

    async function handleDelete(id) {
        if (!window.confirm('هل أنت متأكد من حذف التعليق؟')) return
        setBusyId(id)
        setError('')
        const { data, error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id)
            .select()

        if (error || !data?.length) {
            console.error(error)
            setError('حدث خطأ أثناء حذف التعليق.')
        }
        await load()
        setBusyId(null)
    }

    if (loading) {
        return <p className="text-sm text-ink-400 dark:text-gray-300">جاري تحميل التعليقات...</p>
    }

    return (
        <div dir="rtl" className="space-y-4 text-ink-800 dark:text-white">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">💬 إدارة تعليقات التطبيقات</h2>
                <span className="bg-teal/10 text-teal dark:text-teal-400 px-3 py-1 rounded-full text-xs font-bold">
                    {comments.filter(c => !c.is_approved).length} بانتظار المراجعة
                </span>
            </div>

            {error && (
                <p role="alert" className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">{error}</p>
            )}

            {comments.length === 0 && !error ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center">
                    <p className="text-gray-400 text-sm">لا توجد تعليقات حتى الآن.</p>
                </div>
            ) : (
                comments.map(c => (
                    <div key={c.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="font-bold text-sm text-ink-700 dark:text-white">
                                {c.user_name || 'زائر'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${c.is_approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {c.is_approved ? '✓ معتمد' : '⏳ بانتظار المراجعة'}
                            </span>
                        </div>

                        <p className="text-xs text-teal dark:text-teal-400 mb-2">
                            التطبيق: {c.app_id === 'ayat-quran' ? 'آيات القرآن' : c.app_id}
                        </p>

                        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap break-words mb-4">
                            {c.comment}
                        </p>

                        <div className="flex gap-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                            {!c.is_approved && (
                                <button
                                    disabled={busyId !== null}
                                    onClick={() => handleApprove(c.id)}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-xl text-xs font-bold disabled:opacity-50"
                                >
                                    ✓ قبول وعرض
                                </button>
                            )}
                            <button
                                disabled={busyId !== null}
                                onClick={() => handleDelete(c.id)}
                                className="flex-1 bg-red-500 text-white py-2 rounded-xl text-xs font-bold disabled:opacity-50"
                            >
                                🗑 حذف
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}