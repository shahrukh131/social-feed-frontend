// Common types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ApiErrorResponse {
  statusCode: number
  message: string
  error?: string
}

// User types
export interface User {
  id: string
  email: string
  username: string
  fullName: string
  avatar?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

export interface AuthToken {
  access_token: string
  refresh_token?: string
  expires_in: number
}

// Post types
export interface Post {
  id: string
  content: string
  author: User
  image?: string
  likes: number
  comments: number
  shares: number
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
  likes: number
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
