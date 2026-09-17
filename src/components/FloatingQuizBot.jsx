import { useState } from 'react';
import QuizBotComponent from './QuizBotComponent';

export default function FloatingQuizBot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-5 z-50 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-4 py-3 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95"
            >
                <span className="text-xl">🤖</span>
                <span className="hidden sm:inline text-sm">كويز AI</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 dir-rtl">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl p-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 left-4 text-gray-400 hover:text-white text-base font-bold bg-gray-800 hover:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition z-10"
                        >
                            ✕
                        </button>
                        <QuizBotComponent />
                    </div>
                </div>
            )}
        </>
    );
}