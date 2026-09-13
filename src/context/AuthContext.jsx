import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (!error) setProfile(data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) loadProfile(session.user.id)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) loadProfile(session.user.id)
      else setProfile(null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signUp({ name, email, password, academicYear }) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error }
    const userId = data.user?.id
    if (userId) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        name,
        email,
        academic_year: academicYear
      })
      if (profileError) return { error: profileError }
    }
    return { data }
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
  }

  async function updateAcademicYear(academicYear) {
    if (!session?.user) return
    await supabase.from('profiles').update({ academic_year: academicYear }).eq('id', session.user.id)
    setProfile((p) => ({ ...p, academic_year: academicYear }))
  }

  const value = {
    session,
    user: session?.user || null,
    profile,
    isAdmin: !!profile?.is_admin,
    loading,
    signUp,
    signIn,
    signOut,
    updateAcademicYear
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
