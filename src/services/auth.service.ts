import { apiClient } from './api-client'
import { API_ENDPOINTS, STORAGE_KEYS } from '@/constants'
import { AuthResponse, User } from '@/types'

const toUser = (user: Omit<User, 'fullName'> & { fullName?: string }): User => ({
  ...user,
  fullName: user.fullName ?? `${user.firstName} ${user.lastName}`.trim(),
  username: user.username ?? user.email.split('@')[0],
})

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    })
    return {
      ...response.data,
      user: toUser(response.data.user),
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      email,
      password,
      firstName,
      lastName,
    })
    return {
      ...response.data,
      user: toUser(response.data.user),
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  },

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    }
    return null
  },

  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    }
  },

  getStoredUser: () => {
    if (typeof window === 'undefined') {
      return null
    }

    const storedUser = localStorage.getItem(STORAGE_KEYS.USER)

    if (!storedUser) {
      return null
    }

    try {
      return toUser(JSON.parse(storedUser) as User)
    } catch {
      localStorage.removeItem(STORAGE_KEYS.USER)
      return null
    }
  },
}
