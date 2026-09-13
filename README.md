# Campus Hub

A mobile-first PWA for university students: lectures (PDF), YouTube videos and notes,
organized by academic year and subject — with a support/FAQ page, a suggestions box,
and a password-protected admin dashboard. Built with React + Vite, Tailwind CSS and Supabase.
Supports English and Arabic (full RTL layout).

## 1. Install

```bash
npm install
```

## 2. Create the Supabase project

1. Create a project at https://supabase.com.
2. Open **SQL Editor** → paste the entire contents of `supabase/schema.sql` → **Run**.
   This creates all tables, Row Level Security policies, the `lecture-pdfs` storage
   bucket, and seeds a few dummy years/subjects so the app is previewable immediately.
3. In **Project Settings → API**, copy the **Project URL** and **anon public key**.

## 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

## 4. Run it

```bash
npm run dev
```

Open the printed local URL on your phone (same Wi-Fi) or in a mobile-width browser tab.

## 5. Create your admin account

1. Sign up normally inside the app with the account you want to use as admin.
2. In Supabase, go to **Table editor → profiles**, find that row, and set `is_admin` to `true`
   — or run in the SQL editor:
   ```sql
   update profiles set is_admin = true where email = 'you@example.com';
   ```
3. Go to `/admin/login` in the app and sign in with that same email/password.

## 6. Admin dashboard

From `/admin` you can:
- Add academic years and subjects
- Upload lecture PDFs (stored in the `lecture-pdfs` Supabase Storage bucket)
- Add YouTube video links
- Add text notes
- View every suggestion and support request students have submitted

## 7. Install as an app (PWA)

`npm run build && npm run preview`, then open on a phone and choose
"Add to Home Screen" (iOS Safari) or "Install app" (Android Chrome).
Replace the placeholder files in `public/icons/` with real 192×192 and 512×512
PNG icons before shipping.

## Project structure

```
src/
  context/        Auth (Supabase session/profile) and Lang (EN/AR + RTL) providers
  components/     BottomNav, TopBar, route guards
  pages/          Login, Signup, Home, Subject, Support, Suggestions, Profile
  pages/Admin/    AdminLogin, AdminDashboard
  lib/            supabaseClient.js, content.js (data fetching with dummy-data fallback)
  data/           dummyData.js — used automatically if Supabase has no rows yet
supabase/
  schema.sql      Tables, RLS policies, storage bucket, seed data
```

## Notes on security

- All content tables (`academic_years`, `subjects`, `lectures`, `videos`, `notes`) are
  readable by any signed-in user and writable only by rows where `profiles.is_admin = true`.
- `suggestions` can be inserted by any signed-in user but only read by admins.
- `support_requests` can be inserted by anyone (even signed out) but only read by admins.
- The PDF storage bucket is public for reading (so download links work) but only
  admins can upload/replace/delete files — enforced by Storage RLS policies.
- The admin dashboard route (`/admin`) is guarded client-side **and** every write it
  performs is re-checked server-side by RLS, so a non-admin can't bypass it by
  editing the frontend.
