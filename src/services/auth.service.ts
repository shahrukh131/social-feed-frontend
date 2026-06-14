import { apiClient } from './api-client'
import { User, AuthToken, ApiResponse } from '@/types'

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post<ApiResponse<AuthToken>>('/api/auth/login', {
      email,
      password,
    })
    return response.data
  },

  register: async (email: string, password: string, fullName: string) => {
    const response = await apiClient.post<ApiResponse<AuthToken>>('/api/auth/register', {
      email,
      password,
      fullName,
    })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<User>>('/api/auth/me')
    return response.data
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token')
    }
  },

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token', token)
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token')
    }
    return null
  },
}
