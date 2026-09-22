import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import {
    collection,
    query,
    where,
    onSnapshot
} from 'firebase/firestore'

import TopBar from './TopBar'
import BottomNav from './BottomNav'

function getSupporterBadge(amount) {
    const numAmount = Number(amount) || 0

    if (numAmount >= 100) {
        return {
            title: 'داعم أسطوري 💎',
            badgeClass:
                'bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60',
            icon: '👑'
        }
    }

    if (numAmount >= 50) {
        return {
            title: 'داعم ماسي 🌟',
            badgeClass:
                'bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60',
            icon: '💎'
        }
    }

    if (numAmount >= 25) {
        return {
            title: 'داعم ذهبي 🥇',
            badgeClass:
                'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
            icon: '🥇'
        }
    }

    return {
        title: 'داعم مميز ⭐',
        badgeClass:
            'bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
        icon: '⭐'
    }
}

export default function SupportersWall() {
    const [supporters, setSupporters] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const q = query(
            collection(db, 'donations'),
            where('status', '==', 'approved')
        )

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const list = snapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    .sort((a, b) => {
                        return (Number(b.amount) || 0) - (Number(a.amount) || 0)
                    })

                setSupporters(list)
                setLoading(false)
                setError(false)
            },
            (firebaseError) => {
                console.error('Error loading supporters:', firebaseError)
                setLoading(false)
                setError(true)
            }
        )

        return () => unsubscribe()
    }, [])

    return (
        <div
            className="min-h-screen bg-parchment dark:bg-gray-900 text-ink-800 dark:text-white transition-colors pb-24"
            dir="rtl"
        >
            {/* نفس الهيدر المستخدم في الدعم */}
            <TopBar
                title="الداعمين"
                subtitle="لوحة شرف الأبطال المساهمين في استمرار المنصة 🌟"
            />

            <div className="px-5 mt-5">
                {loading ? (
                    <p className="text-center text-ink-400 dark:text-gray-500 text-sm py-10">
                        جاري تحميل الداعمين...
                    </p>
                ) : error ? (
                    <div className="bg-white dark:bg-gray-800 rounded-card p-6 text-center shadow-sm border border-ink-50 dark:border-gray-700">
                        <p className="text-sm text-coral mb-2">
                            حدث خطأ أثناء تحميل قائمة الداعمين.
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="text-sm bg-teal text-white px-4 py-2 rounded-xl"
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                ) : supporters.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-card p-6 text-center shadow-sm border border-ink-50 dark:border-gray-700">
                        <p className="text-sm text-ink-400 dark:text-gray-400">
                            كن أول الداعمين لاستمرار المنصة! ❤️
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {supporters.map((item, index) => {
                            const badge = getSupporterBadge(item.amount)

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 rounded-card p-4 shadow-sm border border-ink-50 dark:border-gray-700 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">
                                            {index === 0
                                                ? '👑'
                                                : index === 1
                                                    ? '🥈'
                                                    : index === 2
                                                        ? '🥉'
                                                        : badge.icon}
                                        </span>

                                        <div>
                                            <span className="font-bold text-ink-700 dark:text-gray-200 block text-sm">
                                                {item.name || 'داعم كريم'}
                                            </span>

                                            <span className="text-[11px] text-ink-400 dark:text-gray-500">
                                                ساهم في دعم المنصة
                                            </span>
                                        </div>
                                    </div>

                                    <span
                                        className={`text-xs px-2.5 py-1 rounded-md font-medium border ${badge.badgeClass}`}
                                    >
                                        {badge.title}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    )
}