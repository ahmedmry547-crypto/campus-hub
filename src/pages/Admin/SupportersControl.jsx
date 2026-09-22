import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function SupportersControl() {
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        // جلب كل التبرعات (المعلقة والمقبولة) للمراجعة
        const q = query(collection(db, "donations"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDonations(list);
        });

        return () => unsubscribe();
    }, []);

    const handleApprove = async (id) => {
        try {
            await updateDoc(doc(db, "donations", id), { status: 'approved' });
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "donations", id));
        } catch (error) {
            console.error("Error deleting donation: ", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-right">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">لوحة تحكم الداعمين ⚙️</h2>

            {donations.length === 0 ? (
                <p className="text-gray-400 text-center py-8">لا توجد طلبات دعم حتى الآن.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                                <th className="p-3">الاسم</th>
                                <th className="p-3">المبلغ</th>
                                <th className="p-3">الحالة</th>
                                <th className="p-3 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {donations.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50">
                                    <td className="p-3 font-bold text-gray-800">{item.name}</td>
                                    <td className="p-3 font-semibold text-gray-600">{item.amount} ج.م</td>
                                    <td className="p-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-amber-100 text-amber-800'
                                            }`}>
                                            {item.status === 'approved' ? 'مقبول (معروض)' : 'معلق للمراجعة'}
                                        </span>
                                    </td>
                                    <td className="p-3 flex justify-center gap-2">
                                        {item.status !== 'approved' && (
                                            <button
                                                onClick={() => handleApprove(item.id)}
                                                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition"
                                            >
                                                قبول وعرض
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-200 transition"
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}