import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { AuthToken } from '@/types'

export const useLogin = () => {
  const queryClient = useQueryClient()
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await authService.login(email, password)
      return response.data as AuthToken
    },
    onSuccess: (token) => {
      authService.setToken(token.access_token)
      setAuthenticated(true)
      // Invalidate current user query to refetch
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)

  return useMutation({
    mutationFn: async ({
      email,
      password,
      fullName,
    }: {
      email: string
      password: string
      fullName: string
    }) => {
      const response = await authService.register(email, password, fullName)
      return response.data as AuthToken
    },
    onSuccess: (token) => {
      authService.setToken(token.access_token)
      setAuthenticated(true)
      // Invalidate current user query to refetch
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)

  return () => {
    authService.logout()
    setUser(null)
    setAuthenticated(false)
    queryClient.clear()
  }
}
