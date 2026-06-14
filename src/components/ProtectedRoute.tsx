'use client'

import React from 'react'
import { useAuthContext } from '@/auth/auth-context'
import { useRouter } from 'next/navigation'
import { APP_ROUTES } from '@/constants'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.LOGIN)
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
