# Social Feed Frontend

A scalable, modern Next.js frontend for a social feed application built with TypeScript, Tailwind CSS, React Query, and Zustand.

## Features

- ⚡ **Next.js 14** - Latest React framework with App Router
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 📘 **TypeScript** - Fully typed codebase
- 🔄 **React Query** - Server state management
- 🎯 **Zustand** - Lightweight client state management
- 🔐 **JWT Authentication** - Secure token-based auth
- 🎭 **Theme Support** - Light/Dark mode ready
- 📱 **Responsive Design** - Mobile-first approach
- ✅ **ESLint & Prettier** - Code quality and formatting
- 🚀 **Optimized Performance** - Production-ready setup

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # Provider setup (React Query, Theme)
│   ├── globals.css        # Global styles
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── dashboard/         # Protected dashboard
│   ├── feed/              # Social feed
│   ├── profile/[id]/      # User profile
│   └── settings/          # User settings
├── components/             # Reusable React components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Alert.tsx
│   ├── Header.tsx
│   └── ProtectedRoute.tsx
├── services/              # API service layer
│   ├── api-client.ts      # Axios instance with interceptors
│   ├── auth.service.ts    # Authentication APIs
│   ├── posts.service.ts   # Posts APIs
│   ├── comments.service.ts
│   ├── likes.service.ts
│   └── users.service.ts
├── store/                 # Zustand stores
│   ├── auth.store.ts      # Auth state
│   └── ui.store.ts        # UI state
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Auth mutations (login, register, logout)
│   ├── useCurrentUser.ts  # Current user query
│   ├── usePosts.ts        # Posts queries
│   └── usePostMutations.ts # Posts mutations
├── types/                 # TypeScript type definitions
│   └── index.ts
├── lib/                   # Utility functions and providers
│   ├── theme-provider.tsx # Theme context provider
│   └── utils.ts           # Helper functions
├── auth/                  # Authentication utilities
│   ├── auth-context.tsx   # Auth context provider
│   └── auth.utils.ts      # Auth helpers
├── constants/             # Application constants
│   └── index.ts
└── public/                # Static assets
```

## Tech Stack

### Frontend Framework
- **Next.js 14** - React framework with built-in optimization
- **React 18** - UI library
- **TypeScript** - Static type checking

### Styling
- **Tailwind CSS 3** - Utility-first CSS
- **PostCSS** - CSS transformation
- **Autoprefixer** - Browser compatibility

### State Management
- **React Query 5** - Server state (caching, synchronization)
- **Zustand** - Client state (UI, auth persistence)

### HTTP Client
- **Axios** - Promise-based HTTP client with interceptors

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type safety

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or pnpm

### Installation

1. Navigate to the project directory:
```bash
cd social-feed-frontend
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_DEBUG_MODE=false
```

### Development

Start the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

### Build

Create an optimized production build:
```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without changes
- `npm run type-check` - Run TypeScript compiler check

## API Integration

The project includes a service layer for API communication:

### Services

- **auth.service.ts** - Login, register, get current user
- **posts.service.ts** - CRUD operations for posts
- **comments.service.ts** - Comment management
- **likes.service.ts** - Like/unlike functionality
- **users.service.ts** - User profile operations

### API Client

The `api-client.ts` provides:
- Automatic JWT token injection
- Request/response interceptors
- Centralized error handling
- 401 redirect on unauthorized access

### Usage Example

```typescript
import { postsService } from '@/services/posts.service'

const { data } = await postsService.getFeed(1, 10)
```

## Authentication

### Flow

1. User logs in with email/password
2. Backend returns JWT token
3. Token stored in localStorage
4. Token automatically added to all API requests via interceptor
5. On 401, user redirected to login page

### Protected Routes

Wrap components with `ProtectedRoute`:

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <YourContent />
    </ProtectedRoute>
  )
}
```

## State Management

### Server State (React Query)

Server state from API endpoints:
```typescript
import { useFeedPosts } from '@/hooks/usePosts'

export function Feed() {
  const { data: posts, isLoading } = useFeedPosts(1, 10)
  // ...
}
```

### Client State (Zustand)

Local UI state and auth persistence:
```typescript
import { useAuthStore } from '@/store/auth.store'

export function Component() {
  const { user, setUser } = useAuthStore()
  // ...
}
```

## Custom Hooks

### useCurrentUser
Get the current authenticated user:
```typescript
const { data: user, isLoading, error } = useCurrentUser()
```

### useAuth
Handle login/register:
```typescript
const { mutate: login, isPending } = useLogin()
login({ email, password })
```

### useFeedPosts
Fetch paginated posts:
```typescript
const { data: posts, isLoading } = useFeedPosts(page, limit)
```

### usePostMutations
Create, update, delete posts:
```typescript
const { mutate: createPost } = useCreatePost()
createPost({ content, image })
```

## Performance Optimizations

- **Code Splitting** - Next.js automatic route-based splitting
- **Image Optimization** - Built-in image component
- **API Caching** - React Query caching strategy
- **Lazy Loading** - React.lazy for route components
- **CSS Optimization** - Tailwind purging unused styles
- **Tree Shaking** - Unused code removal in production

## Security Considerations

- JWT token stored securely
- HTTPS recommended for production
- CORS configured on backend
- Automatic token refresh on 401
- Type-safe API calls with TypeScript

## Best Practices Implemented

- **Scalable Structure** - Feature-based organization
- **DRY Principle** - Reusable components and services
- **Type Safety** - Comprehensive TypeScript types
- **Error Handling** - Centralized error management
- **Code Quality** - ESLint and Prettier configured
- **Documentation** - JSDoc and inline comments
- **Performance** - Optimized rendering and caching

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Clear cache
```bash
rm -rf .next
npm run dev
```

### Type errors
```bash
npm run type-check
```

## Contributing

1. Create a feature branch
2. Make changes
3. Run `npm run format` to format code
4. Run `npm run lint` to check for errors
5. Commit changes
6. Push to repository

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
- Check existing issues
- Create detailed issue report
- Include steps to reproduce
- Attach error screenshots/logs

---

**Next Steps:**
- Implement authentication logic (Phase 2)
- Build feed components (Phase 3)
- Add post creation (Phase 4)
- Implement like/comment/reply system (Phase 5)
# social-feed-frontend
