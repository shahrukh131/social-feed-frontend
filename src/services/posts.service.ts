import { apiClient } from './api-client'
import { API_ENDPOINTS } from '@/constants'
import { Post, CreatePostPayload, PaginatedResponse, ApiResponse } from '@/types'

type BackendPost = {
  id: string
  text: string
  imageUrl?: string | null
  likeCount: number
  commentCount: number
  likedByCurrentUser: boolean
  createdAt: string
  updatedAt: string
  author: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

const toPost = (post: BackendPost): Post => ({
  id: post.id,
  content: post.text,
  image: post.imageUrl ?? undefined,
  likes: post.likeCount,
  comments: post.commentCount,
  liked: post.likedByCurrentUser,
  shares: 0,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  author: {
    ...post.author,
    fullName: `${post.author.firstName} ${post.author.lastName}`.trim(),
    username: post.author.email.split('@')[0],
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  },
})

export const postsService = {
  getFeed: async (page = 1, limit = 10) => {
    const response = await apiClient.get<BackendPost[]>(
      `${API_ENDPOINTS.POSTS.FEED}?page=${page}&limit=${limit}`
    )
    return {
      data: response.data.map(toPost),
      total: response.data.length,
      page,
      limit,
      hasMore: false,
    } satisfies PaginatedResponse<Post>
  },

  getPostById: async (postId: string) => {
    const response = await apiClient.get<BackendPost>(API_ENDPOINTS.POSTS.GET(postId))
    return {
      success: true,
      data: toPost(response.data),
    } satisfies ApiResponse<Post>
  },

  createPost: async (payload: CreatePostPayload) => {
    const formData = new FormData()
    formData.append('text', payload.content)
    formData.append('visibility', 'public')
    if (payload.image) {
      formData.append('image', payload.image)
    }

    const response = await apiClient.post<BackendPost>(API_ENDPOINTS.POSTS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return {
      success: true,
      data: toPost(response.data),
    } satisfies ApiResponse<Post>
  },

  updatePost: async (postId: string, payload: Partial<CreatePostPayload>) => {
    const response = await apiClient.patch<ApiResponse<Post>>(API_ENDPOINTS.POSTS.UPDATE(postId), payload)
    return response.data
  },

  deletePost: async (postId: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.POSTS.DELETE(postId))
    return response.data
  },
}
