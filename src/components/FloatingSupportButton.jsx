import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function FloatingSupportButton() {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const walletNumber = "01122479813";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !amount) return;

        setLoading(true);
        try {
            await addDoc(collection(db, "donations"), {
                name: name.trim(),
                amount: Number(amount),
                status: 'pending',
                createdAt: new Date()
            });
            setLoading(false);
            setSubmitted(true);
        } catch (error) {
            console.error("Error adding donation: ", error);
            setLoading(false);
            alert("حدث خطأ أثناء الإرسال، تأكد من الاتصال بالإنترنت.");
        }
    };

    return (
        <>
            {/* الزر العائم في ركن الشاشة */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-20 left-4 z-40 bg-gradient-to-r from-red-600 to-amber-500 text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 text-sm font-bold border border-white/20"
                title="ادعم استمرار المنصة"
            >
                <span className="text-xl">☕</span>
                <span className="hidden sm:inline">ادعم المنصة</span>
            </button>

            {/* النافذة المنبثقة لإدخال البيانات */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl text-right">
                        {!submitted ? (
                            <>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">ادعم المطور 🚀</h3>
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                    حول المبلغ على محفظة إتصالات كاش رقم: <span className="font-bold text-red-600">{walletNumber}</span>، ثم املأ البيانات التالية ليسجل اسمك في لوحة الشرف بعد المراجعة:
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">اسمك الكريم</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="مثال: أحمد محمد"
                                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-gray-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ المحول (للترتيب فقط ولا يُعرض)</label>
                                        <input
                                            type="number"
                                            required
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="مثال: 50"
                                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-gray-800"
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
                                        >
                                            {loading ? 'جاري الإرسال...' : 'إرسال للمراجعة'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-4 bg-gray-200 text-gray-800 py-2.5 rounded-xl font-medium hover:bg-gray-300 transition"
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <div className="text-5xl mb-3">🎉</div>
                                <h4 className="text-lg font-bold text-gray-800 mb-2">تم إرسال طلبك بنجاح!</h4>
                                <p className="text-sm text-gray-600 mb-6">
                                    سيتم مراجعة التحويل وإضافة اسمك لقائمة الداعمين قريباً. شكراً لدعمك!
                                </p>
                                <button
                                    onClick={() => { setSubmitted(false); setShowModal(false); }}
                                    className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-medium"
                                >
                                    حسناً
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}