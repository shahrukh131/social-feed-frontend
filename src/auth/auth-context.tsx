'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { authService } from '@/services/auth.service'

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser()
  const { setUser, setAuthenticated, logout: storeLogout } = useAuthStore()
  const hasToken = authService.getToken()

  useEffect(() => {
    if (user) {
      setUser(user)
      setAuthenticated(true)
    }
  }, [user, setUser, setAuthenticated])

  const logout = () => {
    authService.logout()
    storeLogout()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user || !!hasToken,
        isLoading: !!hasToken && isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
