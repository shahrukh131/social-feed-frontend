import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { AuthResponse } from '@/types'

export const useLogin = () => {
  const queryClient = useQueryClient()
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return authService.login(email, password)
    },
    onSuccess: (response: AuthResponse) => {
      authService.setToken(response.accessToken)
      authService.setUser(response.user)
      setUser(response.user)
      setAuthenticated(true)
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: async ({
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string
      password: string
      firstName: string
      lastName: string
    }) => {
      return authService.register(email, password, firstName, lastName)
    },
    onSuccess: (response: AuthResponse) => {
      authService.setToken(response.accessToken)
      authService.setUser(response.user)
      setUser(response.user)
      setAuthenticated(true)
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
