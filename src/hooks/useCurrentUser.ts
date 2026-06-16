import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { User } from '@/types'

export const useCurrentUser = () => {
  const token = authService.getToken()

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return authService.getStoredUser() as User | null
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
