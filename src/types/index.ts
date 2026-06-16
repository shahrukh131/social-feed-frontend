// Common types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiErrorResponse {
  statusCode: number
  message: string | string[]
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// User types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  username?: string
  avatar?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

// Post types
export interface Post {
  id: string
  content: string
  author: User
  image?: string
  likes: number
  comments: number
  shares?: number
  liked: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePostPayload {
  content: string
  image?: File
}

// Comment types
export interface Comment {
  id: string
  content: string
  author: User
  postId: string
  parentCommentId?: string | null
  likes: number
  liked?: boolean
  replyCount?: number
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface CreateCommentPayload {
  content: string
  postId: string
}

// Like types
export interface Like {
  id: string
  userId: string
  postId: string
  createdAt: string
}
