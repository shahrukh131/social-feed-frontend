export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
  },
  POSTS: {
    FEED: '/api/posts/feed',
    CREATE: '/api/posts',
    GET: (id: string) => `/api/posts/${id}`,
    UPDATE: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
  },
  COMMENTS: {
    CREATE: (postId: string) => `/api/posts/${postId}/comments`,
    LIST: (postId: string) => `/api/posts/${postId}/comments`,
    REPLIES: (commentId: string) => `/api/comments/${commentId}/replies`,
    LIKE: (commentId: string) => `/api/comments/${commentId}/like`,
    UNLIKE: (commentId: string) => `/api/comments/${commentId}/like`,
    LIKES: (commentId: string) => `/api/comments/${commentId}/likes`,
  },
  LIKES: {
    POST: (postId: string) => `/api/likes/posts/${postId}`,
    COMMENT: (commentId: string) => `/api/likes/comments/${commentId}`,
  },
  USERS: {
    PROFILE: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    SEARCH: '/api/users/search',
  },
}

export const QUERY_KEYS = {
  AUTH: {
    CURRENT_USER: ['currentUser'],
    USER: (id: string) => ['user', id],
  },
  POSTS: {
    FEED: ['feed'],
    POST: (id: string) => ['post', id],
    ALL: ['posts'],
  },
  COMMENTS: {
    POST_COMMENTS: (postId: string) => ['comments', postId],
  },
  LIKES: {
    POST_LIKES: (postId: string) => ['likes', 'post', postId],
  },
}

export const STORAGE_KEYS = {
  AUTH_TOKEN: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
}

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  FEED: '/feed',
  PROFILE: (id: string) => `/profile/${id}`,
  SETTINGS: '/settings',
}

export const DEFAULT_PAGINATION = {
  LIMIT: 10,
  PAGE: 1,
}
