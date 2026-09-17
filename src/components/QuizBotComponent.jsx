import { useState } from 'react';
import { generateQuizFromText, generateQuizFromImage, generateQuizFromFile } from '../services/geminiQuizService';

export default function QuizBotComponent() {
    const [activeTab, setActiveTab] = useState('text'); // 'text' | 'image' | 'file'
    const [inputText, setInputText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setQuestions(null);
        setAnswers({});
        setSubmitted(false);

        try {
            let generatedQuiz;
            if (activeTab === 'text') {
                if (!inputText.trim()) return;
                generatedQuiz = await generateQuizFromText(inputText, 5);
            } else if (activeTab === 'image') {
                if (!selectedImage) return;
                generatedQuiz = await generateQuizFromImage(selectedImage, 5);
            } else if (activeTab === 'file') {
                if (!selectedFile) return;
                generatedQuiz = await generateQuizFromFile(selectedFile, 5);
            }
            setQuestions(generatedQuiz);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = (qIdx, optIdx) => {
        if (submitted) return;
        setAnswers({ ...answers, [qIdx]: optIdx });
    };

    const handleSubmit = () => {
        let currentScore = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct) currentScore++;
        });
        setScore(currentScore);
        setSubmitted(true);
    };

    const isButtonDisabled = () => {
        if (loading) return true;
        if (activeTab === 'text') return !inputText.trim();
        if (activeTab === 'image') return !selectedImage;
        if (activeTab === 'file') return !selectedFile;
        return true;
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-2xl dir-rtl">
            <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo-400 flex items-center justify-center gap-2">
                    <span>🤖</span> بوت الاختبارات الذكي
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                    قم برفع ملف PDF، صورة المحاضرة، أو انسخ النص مباشرة لإنشاء الاختبار!
                </p>
            </div>

            {!questions ? (
                <div className="space-y-4">
                    {/* التبويبات الثلاثة */}
                    <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
                        <button
                            onClick={() => setActiveTab('text')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'text' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            📝 لصق نص
                        </button>
                        <button
                            onClick={() => setActiveTab('image')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'image' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            🖼️ رفع صورة
                        </button>
                        <button
                            onClick={() => setActiveTab('file')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'file' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            📄 رفع PDF
                        </button>
                    </div>

                    {/* محتوى التبويب */}
                    {activeTab === 'text' && (
                        <textarea
                            rows="6"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="الصق جزءاً من المحاضرة أو الملخص هنا..."
                            className="w-full p-4 bg-gray-800 rounded-xl border border-gray-700 text-white focus:outline-none focus:border-indigo-500 text-sm"
                        />
                    )}

                    {activeTab === 'image' && (
                        <div className="border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl p-6 text-center bg-gray-800/50 transition">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer block">
                                {imagePreview ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <img src={imagePreview} alt="معاينة" className="max-h-48 rounded-lg border border-gray-600 object-contain" />
                                        <span className="text-xs text-indigo-400 underline">اضغط لتغيير الصورة</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-3xl mb-2">📸</div>
                                        <p className="text-sm font-semibold text-gray-300">
                                            اضغط هنا لاختيار صورة السلايد أو المحاضرة
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">يدعم صيغ PNG, JPG, JPEG</p>
                                    </>
                                )}
                            </label>
                        </div>
                    )}

                    {activeTab === 'file' && (
                        <div className="border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl p-6 text-center bg-gray-800/50 transition">
                            <input
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer block">
                                {selectedFile ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-4xl">📄</div>
                                        <p className="text-sm font-bold text-indigo-400">{selectedFile.name}</p>
                                        <span className="text-xs text-gray-400 underline">اضغط لتغيير الملف</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-3xl mb-2">📁</div>
                                        <p className="text-sm font-semibold text-gray-300">
                                            اضغط هنا لاختيار ملف الـ PDF
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">يدعم ملفات PDF النصية والممسوحة ضوئياً</p>
                                    </>
                                )}
                            </label>
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={isButtonDisabled()}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 font-bold rounded-xl transition flex items-center justify-center gap-2"
                    >
                        {loading ? "جاري معالجة المحتوى وتوليد الكويز... ⏳" : "إنشاء الكويز الآن 🚀"}
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span className="text-sm text-gray-400">عدد الأسئلة: {questions.length}</span>
                        <button
                            onClick={() => {
                                setQuestions(null);
                                setInputText('');
                                setSelectedImage(null);
                                setImagePreview(null);
                                setSelectedFile(null);
                            }}
                            className="text-sm text-red-400 hover:underline"
                        >
                            اختبار جديد 🔄
                        </button>
                    </div>

                    {questions.map((q, qIdx) => (
                        <div key={qIdx} className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                            <h3 className="font-bold text-base sm:text-lg mb-3">{qIdx + 1}. {q.question}</h3>
                            <div className="space-y-2">
                                {q.options.map((opt, optIdx) => {
                                    let btnStyle = "bg-gray-700 hover:bg-gray-600 border-gray-600";
                                    if (answers[qIdx] === optIdx) btnStyle = "bg-indigo-600 border-indigo-400";

                                    if (submitted) {
                                        if (optIdx === q.correct) btnStyle = "bg-green-600 border-green-500 font-bold";
                                        else if (answers[qIdx] === optIdx) btnStyle = "bg-red-600 border-red-500";
                                    }

                                    return (
                                        <button
                                            key={optIdx}
                                            onClick={() => handleSelectOption(qIdx, optIdx)}
                                            className={`w-full text-right p-3 rounded-lg border text-sm transition-all ${btnStyle}`}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                            {submitted && (
                                <p className="text-xs text-indigo-300 mt-2 bg-gray-900 p-2 rounded border border-gray-700">
                                    💡 {q.explanation}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="text-center pt-2">
                        {!submitted ? (
                            <button
                                onClick={handleSubmit}
                                disabled={Object.keys(answers).length < questions.length}
                                className="px-8 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 font-bold rounded-xl text-sm"
                            >
                                تسليم الإجابات
                            </button>
                        ) : (
                            <div className="p-4 bg-gray-800 rounded-xl border border-indigo-500">
                                <h3 className="text-xl font-bold text-indigo-400">
                                    النتيجة: {score} من {questions.length}
                                </h3>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}