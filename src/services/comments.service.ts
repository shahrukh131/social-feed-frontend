import { apiClient } from './api-client'
import { API_ENDPOINTS } from '@/constants'
import { ApiResponse, Comment } from '@/types'

type BackendComment = {
  id: string
  postId: string
  parentCommentId?: string | null
  body: string
  likeCount: number
  replyCount: number
  likedByCurrentUser: boolean
  createdAt: string
  updatedAt: string
  author: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  replies?: BackendComment[]
}

const toComment = (comment: BackendComment): Comment => ({
  id: comment.id,
  postId: comment.postId,
  parentCommentId: comment.parentCommentId ?? null,
  content: comment.body,
  likes: comment.likeCount,
  liked: comment.likedByCurrentUser,
  replyCount: comment.replyCount,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  author: {
    ...comment.author,
    fullName: `${comment.author.firstName} ${comment.author.lastName}`.trim(),
    username: comment.author.email.split('@')[0],
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  },
  replies: (comment.replies ?? []).map(toComment),
})

export const commentsService = {
  getPostComments: async (postId: string) => {
    const response = await apiClient.get<BackendComment[]>(API_ENDPOINTS.COMMENTS.LIST(postId))
    return response.data.map(toComment)
  },

  createComment: async (postId: string, content: string) => {
    const response = await apiClient.post<BackendComment>(API_ENDPOINTS.COMMENTS.CREATE(postId), {
      body: content,
    })

    return {
      success: true,
      data: toComment(response.data),
    } satisfies ApiResponse<Comment>
  },
}
