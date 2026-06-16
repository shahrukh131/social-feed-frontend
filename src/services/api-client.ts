import axios, { AxiosInstance, AxiosError } from 'axios'

const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem(AUTH_TOKEN_KEY)
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY)
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  get<T>(url: string, config = {}) {
    return this.client.get<T>(url, config)
  }

  post<T>(url: string, data?: unknown, config = {}) {
    return this.client.post<T>(url, data, config)
  }

  put<T>(url: string, data?: unknown, config = {}) {
    return this.client.put<T>(url, data, config)
  }

  patch<T>(url: string, data?: unknown, config = {}) {
    return this.client.patch<T>(url, data, config)
  }

  delete<T>(url: string, config = {}) {
    return this.client.delete<T>(url, config)
  }
}

export const apiClient = new ApiClient()
