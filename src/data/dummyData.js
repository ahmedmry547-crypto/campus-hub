// Fallback content used when Supabase has no rows yet (fresh project) or
// when env vars aren't configured, so the UI is always previewable.

export const dummyYears = [
  {
    id: 'y1',
    name: 'Year 1',
    name_ar: 'السنة الأولى',
    order_index: 1,
    subjects: [
      {
        id: 's1',
        name: 'Calculus I',
        name_ar: 'التفاضل والتكامل ١',
        description: 'Limits, derivatives and integrals of single-variable functions.',
        lectures: [
          { id: 'l1', title: 'Lecture 1 — Limits', file_path: null, file_url: '#', size_label: '2.1 MB' },
          { id: 'l2', title: 'Lecture 2 — Derivatives', file_path: null, file_url: '#', size_label: '1.8 MB' }
        ],
        videos: [
          { id: 'v1', title: 'Intro to Limits', youtube_url: 'https://www.youtube.com/watch?v=riXcZT2ICjA' }
        ],
        notes: [
          { id: 'n1', title: 'Chapter 1 Summary', content: 'Key definitions: limit, continuity, derivative as a limit of a difference quotient.' }
        ]
      },
      {
        id: 's2',
        name: 'Programming Fundamentals',
        name_ar: 'أساسيات البرمجة',
        description: 'Variables, control flow, functions and basic data structures.',
        lectures: [
          { id: 'l3', title: 'Lecture 1 — Intro to C', file_path: null, file_url: '#', size_label: '3.4 MB' }
        ],
        videos: [
          { id: 'v2', title: 'Variables & Data Types', youtube_url: 'https://www.youtube.com/watch?v=zOjov-2OZ0E' }
        ],
        notes: [
          { id: 'n2', title: 'Cheat Sheet — Loops', content: 'for vs while vs do-while, and when to use each.' }
        ]
      }
    ]
  },
  {
    id: 'y2',
    name: 'Year 2',
    name_ar: 'السنة الثانية',
    order_index: 2,
    subjects: [
      {
        id: 's3',
        name: 'Data Structures',
        name_ar: 'هياكل البيانات',
        description: 'Stacks, queues, linked lists, trees and hash tables.',
        lectures: [
          { id: 'l4', title: 'Lecture 1 — Linked Lists', file_path: null, file_url: '#', size_label: '2.9 MB' }
        ],
        videos: [],
        notes: [
          { id: 'n3', title: 'Big-O Quick Reference', content: 'O(1), O(log n), O(n), O(n log n), O(n^2) — common examples of each.' }
        ]
      },
      {
        id: 's4',
        name: 'Database Systems',
        name_ar: 'نظم قواعد البيانات',
        description: 'Relational design, SQL and normalization.',
        lectures: [],
        videos: [
          { id: 'v3', title: 'ER Diagrams Explained', youtube_url: 'https://www.youtube.com/watch?v=QpdhBUYk7Kk' }
        ],
        notes: []
      }
    ]
  },
  {
    id: 'y3',
    name: 'Year 3',
    name_ar: 'السنة الثالثة',
    order_index: 3,
    subjects: [
      {
        id: 's5',
        name: 'Operating Systems',
        name_ar: 'نظم التشغيل',
        description: 'Processes, scheduling, memory management and file systems.',
        lectures: [],
        videos: [],
        notes: []
      }
    ]
  }
]

export const dummyFaqs = [
  {
    q: 'How do I download a lecture PDF?',
    q_ar: 'كيف أحمّل ملف محاضرة PDF؟',
    a: 'Open the subject page, go to the Lectures tab, and tap the download icon next to any file.',
    a_ar: 'افتح صفحة المادة، ثم تبويب المحاضرات، واضغط على أيقونة التحميل بجانب أي ملف.'
  },
  {
    q: 'I can\'t log in — what should I do?',
    q_ar: 'لا أستطيع تسجيل الدخول، ماذا أفعل؟',
    a: 'Double-check your email is spelled correctly. If you still can\'t get in, use the contact form below.',
    a_ar: 'تأكد من كتابة بريدك الإلكتروني بشكل صحيح. إذا استمرت المشكلة استخدم نموذج التواصل أدناه.'
  },
  {
    q: 'Can I change my academic year after signing up?',
    q_ar: 'هل يمكنني تغيير السنة الدراسية بعد التسجيل؟',
    a: 'Yes — go to your profile menu and update your batch/year at any time.',
    a_ar: 'نعم، يمكنك تحديث السنة الدراسية في أي وقت من قائمة الملف الشخصي.'
  },
  {
    q: 'How do I suggest a new subject or resource?',
    q_ar: 'كيف أقترح مادة أو مصدر جديد؟',
    a: 'Use the Suggestions page from the bottom navigation — your feedback goes straight to the admins.',
    a_ar: 'استخدم صفحة الاقتراحات من الشريط السفلي، وستصل ملاحظاتك مباشرة إلى المشرفين.'
  }
]
