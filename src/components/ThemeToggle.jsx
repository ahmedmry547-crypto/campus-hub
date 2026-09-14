import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 px-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 transition-colors font-medium text-sm"
        >
            {darkMode ? '☀️ الوضع الفاتح' : '🌙 الوضع الليلي'}
        </button>
    );
}