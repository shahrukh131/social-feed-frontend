'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setAuthenticated,
    setLoading,
    logout: storeLogout,
  } = useAuthStore()

  useEffect(() => {
    setLoading(true)

    const token = authService.getToken()
    const storedUser = authService.getStoredUser()

    if (token && storedUser) {
      setUser(storedUser)
      setAuthenticated(true)
    } else {
      setUser(null)
      setAuthenticated(false)
    }

    setLoading(false)
  }, [setAuthenticated, setLoading, setUser])

  const logout = () => {
    authService.logout()
    storeLogout()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
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
