import React, { createContext, useContext, useEffect, useState } from 'react'

const LangContext = createContext(null)

const STRINGS = {
  en: {
    home: 'Home', support: 'Support', suggestions: 'Suggestions', profile: 'Profile',
    years: 'Academic Years', subjects: 'Subjects', lectures: 'Lectures', videos: 'Videos', notes: 'Notes',
    login: 'Log in', signup: 'Sign up', logout: 'Log out', email: 'Email', password: 'Password',
    name: 'Full name', academicYear: 'Academic year', welcome: 'Welcome back',
    createAccount: 'Create your account', download: 'Download', watch: 'Watch',
    faqTitle: 'Frequently asked questions', contactUs: 'Still need help? Contact us',
    yourMessage: 'Your message', send: 'Send', suggestionTitle: 'Share a suggestion',
    suggestionSub: 'Missing a subject, a broken link, an idea? Tell us.', submit: 'Submit',
    admin: 'Admin', adminDashboard: 'Admin dashboard', noContent: 'Nothing here yet.'
  },
  ar: {
    home: 'الرئيسية', support: 'الدعم', suggestions: 'الاقتراحات', profile: 'الملف الشخصي',
    years: 'السنوات الدراسية', subjects: 'المواد', lectures: 'المحاضرات', videos: 'الفيديوهات', notes: 'الملاحظات',
    login: 'تسجيل الدخول', signup: 'إنشاء حساب', logout: 'تسجيل الخروج', email: 'البريد الإلكتروني', password: 'كلمة المرور',
    name: 'الاسم الكامل', academicYear: 'السنة الدراسية', welcome: 'مرحبًا بعودتك',
    createAccount: 'أنشئ حسابك', download: 'تحميل', watch: 'مشاهدة',
    faqTitle: 'الأسئلة الشائعة', contactUs: 'ما زلت بحاجة للمساعدة؟ تواصل معنا',
    yourMessage: 'رسالتك', send: 'إرسال', suggestionTitle: 'شاركنا اقتراحًا',
    suggestionSub: 'مادة ناقصة، رابط لا يعمل، فكرة جديدة؟ أخبرنا.', submit: 'إرسال',
    admin: 'الإدارة', adminDashboard: 'لوحة تحكم الإدارة', noContent: 'لا يوجد محتوى بعد.'
  }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('campus-hub-lang') || 'en')

  useEffect(() => {
    localStorage.setItem('campus-hub-lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const t = (key) => STRINGS[lang][key] || key
  const toggleLang = () => setLang((l) => (l === 'en' ? 'ar' : 'en'))

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, t, isRtl: lang === 'ar' }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
