import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <FullscreenLoader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

export function AdminRoute({ children }) {
  const { isAdmin, loading, user } = useAuth()
  if (loading) return <FullscreenLoader />
  if (!user) return <Navigate to="/admin/login" replace />
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return children
}

export function FullscreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment">
      <div className="w-8 h-8 rounded-full border-4 border-ink-100 border-t-brass animate-spin" />
    </div>
  )
}
