import { apiClient } from './api-client'
import { Post, CreatePostPayload, PaginatedResponse, ApiResponse } from '@/types'

export const postsService = {
  getFeed: async (page = 1, limit = 10) => {
    const response = await apiClient.get<PaginatedResponse<Post>>(
      `/api/posts/feed?page=${page}&limit=${limit}`
    )
    return response.data
  },

  getPostById: async (postId: string) => {
    const response = await apiClient.get<ApiResponse<Post>>(`/api/posts/${postId}`)
    return response.data
  },

  createPost: async (payload: CreatePostPayload) => {
    const formData = new FormData()
    formData.append('content', payload.content)
    if (payload.image) {
      formData.append('image', payload.image)
    }

    const response = await apiClient.post<ApiResponse<Post>>('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  updatePost: async (postId: string, payload: Partial<CreatePostPayload>) => {
    const response = await apiClient.patch<ApiResponse<Post>>(`/api/posts/${postId}`, payload)
    return response.data
  },

  deletePost: async (postId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/api/posts/${postId}`)
    return response.data
  },
}
