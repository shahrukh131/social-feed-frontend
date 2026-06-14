'use client'

import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  Bookmark,
  CalendarDays,
  FileText,
  Gamepad2,
  Home,
  ImageIcon,
  Lightbulb,
  MessageCircle,
  MoreVertical,
  Search,
  Send,
  Settings,
  Share2,
  Users,
  Video,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/theme-toggle'
import { Toast } from '@/components/Toast'
import { useAuthContext } from '@/auth/auth-context'
import { APP_ROUTES } from '@/constants'
import { postsService } from '@/services/posts.service'
import type { PaginatedResponse, Post } from '@/types'
import { cn } from '@/lib/cn'
import { formatDate, getInitials } from '@/lib/utils'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700', '800'],
})

const leftMenu = [
  { label: 'Learning', icon: Lightbulb, badge: 'New' },
  { label: 'Insights', icon: FileText },
  { label: 'Find friends', icon: Users },
  { label: 'Bookmarks', icon: Bookmark },
  { label: 'Group', icon: Users },
  { label: 'Gaming', icon: Gamepad2, badge: 'New' },
  { label: 'Settings', icon: Settings },
  { label: 'Save post', icon: Bookmark },
]

const stories = [
  { type: 'self', name: 'Your Story', image: '/assets/images/card_ppl1.png' },
  { type: 'user', name: 'Ryan Roslansky', image: '/assets/images/card_ppl2.png' },
  { type: 'user', name: 'Ryan Roslansky', image: '/assets/images/card_ppl3.png' },
  { type: 'user', name: 'Ryan Roslansky', image: '/assets/images/card_ppl4.png' },
] as const

const suggestedPeople = [
  { name: 'Steve Jobs', title: 'CEO of Apple', image: '/assets/images/people1.png' },
  { name: 'Ryan Roslansky', title: 'CEO of Linkedin', image: '/assets/images/people2.png' },
  { name: 'Dylan Field', title: 'CEO of Figma', image: '/assets/images/people3.png' },
]

const friends = [
  { name: 'Steve Jobs', title: 'CEO of Apple', image: '/assets/images/people1.png', status: '5 minute ago', online: false },
  { name: 'Ryan Roslansky', title: 'CEO of Linkedin', image: '/assets/images/people2.png', status: '', online: true },
  { name: 'Dylan Field', title: 'CEO of Figma', image: '/assets/images/people3.png', status: '', online: true },
  { name: 'Steve Jobs', title: 'CEO of Apple', image: '/assets/images/people1.png', status: '5 minute ago', online: false },
  { name: 'Ryan Roslansky', title: 'CEO of Linkedin', image: '/assets/images/people2.png', status: '', online: true },
  { name: 'Dylan Field', title: 'CEO of Figma', image: '/assets/images/people3.png', status: '', online: true },
  { name: 'Dylan Field', title: 'CEO of Figma', image: '/assets/images/people3.png', status: '', online: true },
  { name: 'Steve Jobs', title: 'CEO of Apple', image: '/assets/images/people1.png', status: '5 minute ago', online: false },
]

const engagementIcons = [
  '/assets/images/react_img1.png',
  '/assets/images/react_img2.png',
  '/assets/images/react_img3.png',
  '/assets/images/react_img4.png',
  '/assets/images/react_img5.png',
]

export default function FeedPage() {
  const { user } = useAuthContext()
  const [posts, setPosts] = useState<Post[]>([])
  const [postContent, setPostContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

  const displayName = user?.fullName || 'Dylan Field'
  const displayEmail = user?.email || 'dylan@figma.com'
  const profilePath = user?.id ? APP_ROUTES.PROFILE(user.id) : '#'

  const feedPosts = useMemo(() => {
    if (posts.length > 0) {
      return posts
    }

    return [
      {
        id: 'mock-post-1',
        content: '-Healthy Tracking App',
        author: {
          id: 'mock-author-1',
          email: displayEmail,
          username: 'karimsaif',
          fullName: 'Karim Saif',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        likes: 122,
        comments: 12,
        shares: 122,
        liked: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        image: '/assets/images/timeline_img.png',
      },
    ] satisfies Post[]
  }, [displayEmail, posts])

  useEffect(() => {
    const loadFeed = async () => {
      try {
        setIsLoading(true)
        setErrorMessage(null)

        const response = await postsService.getFeed(1, 20)
        const feedItems = Array.isArray((response as PaginatedResponse<Post>).data)
          ? ((response as PaginatedResponse<Post>).data ?? [])
          : []

        setPosts(feedItems)
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message || 'Unable to load the feed right now.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadFeed()
  }, [])

  const handleCreatePost = async () => {
    const trimmedContent = postContent.trim()

    if (!trimmedContent) {
      setToast({ type: 'error', message: 'Write something before posting.' })
      return
    }

    try {
      setIsPosting(true)
      const response = await postsService.createPost({ content: trimmedContent })
      const createdPost = response.data

      if (createdPost) {
        setPosts((currentPosts) => [createdPost, ...currentPosts])
      }

      setPostContent('')
      setToast({ type: 'success', message: 'Post published successfully.' })
    } catch (error: any) {
      setToast({
        type: 'error',
        message: error?.response?.data?.message || 'Unable to create post right now.',
      })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className={cn(`min-h-screen bg-background text-foreground ${poppins.className} transition-colors`)}>
        {/* ── Top navigation bar ── */}
        <header className="sticky top-0 z-40 border-b border-border bg-card transition-colors">
        <div className="mx-auto flex max-w-[1180px] items-center gap-6 px-4 py-3 lg:px-6">
          <Link href={APP_ROUTES.FEED} className="shrink-0">
            <Image
              src="/assets/images/logo.svg"
              alt="Buddy Script"
              width={145}
              height={36}
              className="h-auto w-auto"
              priority
            />
          </Link>

          <div className="hidden flex-1 lg:block">
            <div className="relative mx-auto max-w-[320px] xl:max-w-[360px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="input search text"
                className={cn(
                  'h-11 w-full rounded-full border pl-11 pr-4 text-sm outline-none transition-colors',
                  'border-input bg-muted text-foreground placeholder:text-muted-foreground'
                )}
              />
            </div>
          </div>

          <nav className="ml-auto flex items-center gap-2 sm:gap-4">
            {[
              { icon: Home, active: true, count: undefined },
              { icon: Users, active: false, count: undefined },
              { icon: Bell, active: false, count: '6' },
              { icon: MessageCircle, active: false, count: '2' },
            ].map((item, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  'relative flex h-11 w-11 items-center justify-center rounded-none border-b-2 transition',
                  item.active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-primary'
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.count ? (
                  <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {item.count}
                  </span>
                ) : null}
              </button>
            ))}

            <Link href={profilePath} className="flex items-center gap-2 pl-1">
              <Avatar className="h-8 w-8">
                <AvatarFallback
                  className="bg-muted text-[11px] text-muted-foreground"
                >
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-foreground sm:inline">
                {displayName}
              </span>
            </Link>
          </nav>
        </div>
        </header>

      <main className="mx-auto max-w-[1180px] px-4 py-3 lg:px-6">
        {toast ? (
          <div className="mb-4">
            <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[230px_minmax(0,1fr)_230px]">
          {/* ── Left sidebar ── */}
          <aside className="hidden xl:block">
            <div className="space-y-3">
              {/* Explore menu */}
              <Card className="rounded-[6px] border-transparent bg-card shadow-none">
                <CardContent className="p-5">
                  <h3 className="mb-3 text-[16px] font-semibold text-foreground">Explore</h3>
                  <div className="space-y-1">
                    {leftMenu.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className={cn(
                          'flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-[14px]',
                          'text-muted-foreground transition hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          {item.label}
                        </span>
                        {item.badge ? (
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Suggested People */}
              <Card className="rounded-[6px] border-transparent bg-card shadow-none">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-foreground">Suggested People</h3>
                    <button type="button" className="text-[11px] font-medium text-primary">
                      See All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {suggestedPeople.map((person) => (
                      <div key={person.name} className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-3">
                          <Image
                            src={person.image}
                            alt={person.name}
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-medium text-foreground">
                              {person.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {person.title}
                            </p>
                          </div>
                        </div>
                        <button type="button" className="rounded-[2px] border border-input px-3 py-1.5 text-[12px] text-muted-foreground transition hover:border-primary hover:text-primary">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Events */}
              <Card className="rounded-[6px] border-transparent bg-card shadow-none">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-foreground">Events</h3>
                    <button type="button" className="text-[11px] font-medium text-primary">
                      See all
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-[4px] border border-border">
                    <Image
                      src="/assets/images/feed_event1.png"
                      alt="No more terrorism no more cry"
                      width={260}
                      height={148}
                      className="h-[120px] w-full object-cover"
                    />
                    <div className="p-4">
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-[2px] bg-secondary text-secondary-foreground">
                          <span className="text-[18px] font-semibold leading-none">10</span>
                          <span className="text-[12px] leading-none">Jul</span>
                        </div>
                        <p className="text-[15px] font-medium leading-5 text-foreground">
                          No more terrorism no more cry
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                        <span className="text-[11px] text-muted-foreground">
                          17 People Going
                        </span>
                        <button
                          type="button"
                          className="rounded-[2px] border border-primary px-3 py-1 text-[12px] text-primary"
                        >
                          Going
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* ── Main feed ── */}
          <section className="min-w-0">
            {/* Stories – desktop grid */}
            <div className="mb-3 hidden grid-cols-4 gap-3 md:grid">
              {stories.map((story, index) => (
                <div key={`${story.type}-${story.name}-${index}`} className="relative overflow-hidden rounded-[6px]">
                  <Image
                    src={story.image}
                    alt={story.name}
                    width={180}
                    height={136}
                    className="h-[116px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/45" />

                  {story.type === 'self' ? (
                    <div
                      className={cn(
                        'absolute inset-x-0 bottom-0 rounded-t-[24px] pt-6',
                        'bg-primary/90 dark:bg-accent'
                      )}
                    >
                      <button
                        type="button"
                        className="absolute left-1/2 top-0 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      >
                        +
                      </button>
                      <p className="pb-2 text-center text-[12px] font-medium text-white">{story.name}</p>
                    </div>
                  ) : (
                    <>
                      <Image
                        src="/assets/images/mini_pic.png"
                        alt=""
                        width={28}
                        height={28}
                        className="absolute right-3 top-3 h-7 w-7 rounded-full border-2 border-white"
                      />
                      <p className="absolute inset-x-0 bottom-2 text-center text-[12px] font-medium text-white">
                        {story.name}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Stories – mobile scroll */}
            <div className="mb-3 flex gap-3 overflow-x-auto md:hidden">
              {stories.map((story, index) => (
                <div key={`${story.type}-${story.name}-${index}`} className="min-w-[80px]">
                  <div className="relative h-[72px] overflow-hidden rounded-[18px]">
                    <Image
                      src={
                        story.type === 'self'
                          ? '/assets/images/mobile_story_img.png'
                          : story.image === '/assets/images/card_ppl2.png'
                            ? '/assets/images/mobile_story_img1.png'
                            : '/assets/images/mobile_story_img2.png'
                      }
                      alt={story.name}
                      width={80}
                      height={72}
                      className="h-full w-full object-cover"
                    />
                    {story.type === 'self' ? (
                      <button
                        type="button"
                        className="absolute left-1/2 top-full flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      >
                        +
                      </button>
                    ) : null}
                  </div>
                  <p className="mt-3 truncate text-center text-[12px] font-medium text-muted-foreground">
                    {story.name}
                  </p>
                </div>
              ))}
            </div>

            {/* Post composer */}
            <Card className="mb-3 rounded-[6px] border-transparent bg-card shadow-none">
              <CardContent className="p-5">
                <div className="mb-5 flex items-start gap-3">
                  <Image
                    src="/assets/images/txt_img.png"
                    alt="Current user"
                    width={32}
                    height={32}
                    className="mt-0.5 h-8 w-8 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <Textarea
                      value={postContent}
                      onChange={(event) => setPostContent(event.target.value)}
                      placeholder="Write something ..."
                      rows={3}
                      className={cn(
                        'min-h-[58px] resize-none border-0 px-0 py-0 text-[16px] shadow-none focus-visible:ring-0',
                        'bg-transparent text-foreground placeholder:text-muted-foreground'
                      )}
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    'flex flex-col gap-3 rounded-[4px] px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
                    'bg-accent'
                  )}
                >
                  <div
                    className={cn(
                      'flex flex-wrap items-center gap-4 text-[14px]',
                      'text-muted-foreground'
                    )}
                  >
                    {[
                      { label: 'Photo', icon: ImageIcon },
                      { label: 'Video', icon: Video },
                      { label: 'Event', icon: CalendarDays },
                      { label: 'Article', icon: FileText },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className="inline-flex items-center gap-2 transition hover:text-primary"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={() => void handleCreatePost()}
                    disabled={isPosting}
                    className="h-[38px] rounded-[4px] bg-primary px-5 text-primary-foreground hover:bg-primary/90"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isPosting ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feed posts */}
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <Card key={index} className="rounded-[6px] border-transparent bg-card shadow-none">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                        <div className="space-y-2">
                          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                          <div className="h-3 w-24 animate-pulse rounded bg-muted/70" />
                        </div>
                      </div>
                      <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted/70" />
                      <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-muted/70" />
                      <div className="mt-4 h-64 animate-pulse rounded-[6px] bg-muted/70" />
                    </CardContent>
                  </Card>
                ))
              ) : errorMessage ? (
                <Card className="rounded-[6px] border-transparent bg-card shadow-none">
                  <CardContent className="p-8 text-center">
                    <p className="text-[18px] font-medium text-foreground">Could not load feed</p>
                    <p className="mt-2 text-[14px] text-muted-foreground">{errorMessage}</p>
                  </CardContent>
                </Card>
              ) : (
                feedPosts.map((post, index) => (
                  <Card key={post.id} className="rounded-[6px] border-transparent bg-card shadow-none">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={index % 2 === 0 ? '/assets/images/profile-1.png' : '/assets/images/txt_img.png'}
                            alt={post.author?.fullName || 'User'}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-[16px] font-medium text-foreground">
                              {post.author?.fullName || 'Unknown user'}
                            </p>
                            <p className="text-[13px] text-muted-foreground">
                              {formatDate(post.createdAt)} .{' '}
                              <span className="text-muted-foreground">Public</span>
                            </p>
                          </div>
                        </div>

                        <button type="button" className="text-muted-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mb-4 whitespace-pre-wrap text-[14px] leading-6 text-foreground">
                        {post.content}
                      </p>

                      {post.image ? (
                        <div className="mb-4 overflow-hidden rounded-[6px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.image} alt="Post media" className="h-auto w-full object-cover" />
                        </div>
                      ) : index === 0 ? (
                        <div className="mb-4 overflow-hidden rounded-[6px]">
                          <Image
                            src="/assets/images/timeline_img.png"
                            alt="Timeline preview"
                            width={760}
                            height={430}
                            className="h-auto w-full object-cover"
                          />
                        </div>
                      ) : null}

                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            {engagementIcons.map((icon, iconIndex) => (
                              <Image
                                key={`${post.id}-${iconIndex}`}
                                src={icon}
                                alt=""
                                width={28}
                                height={28}
                                className={`${iconIndex === 0 ? '' : '-ml-2'} h-7 w-7 rounded-full border border-white`}
                              />
                            ))}
                            <div className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary text-[11px] text-primary-foreground">
                              9+
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
                          <span>{post.comments} Comment</span>
                          <span>{post.shares || 122} Share</span>
                        </div>
                      </div>

                      <div className="mb-5 grid grid-cols-3 gap-2 bg-muted/60 p-2">
                        <button
                          type="button"
                          className={cn(
                            'flex h-9 items-center justify-center gap-2 rounded-[2px] text-[14px]',
                            'bg-accent text-accent-foreground'
                          )}
                        >
                          <span className="text-[15px]">🙂</span>
                          Haha
                        </button>
                        <button
                          type="button"
                          className={cn(
                            'flex h-9 items-center justify-center gap-2 rounded-[2px] text-[14px] transition',
                            'text-foreground hover:bg-accent'
                          )}
                        >
                          <MessageCircle className="h-4 w-4" />
                          Comment
                        </button>
                        <button
                          type="button"
                          className={cn(
                            'flex h-9 items-center justify-center gap-2 rounded-[2px] text-[14px] transition',
                            'text-foreground hover:bg-accent'
                          )}
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </button>
                      </div>

                      <div className="rounded-[18px] bg-muted px-4 py-2">
                        <div className="flex items-center gap-3">
                          <Image
                            src="/assets/images/comment_img.png"
                            alt=""
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded-full"
                          />
                          <input
                            type="text"
                            placeholder="Write a comment"
                            className={cn(
                              'h-8 w-full bg-transparent text-[14px] outline-none',
                              'text-foreground placeholder:text-muted-foreground'
                            )}
                          />
                          <button type="button" className="text-muted-foreground">
                            <Bell className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

          {/* ── Right sidebar ── */}
          <aside className="hidden xl:block">
            <div className="space-y-3">
              {/* You Might Like */}
              <Card className="rounded-[6px] border-transparent bg-card shadow-none">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-foreground">You Might Like</h3>
                    <button type="button" className="text-[11px] font-medium text-primary">
                      See All
                    </button>
                  </div>

                  <div className="mb-5 flex items-center gap-3">
                    <Image
                      src="/assets/images/Avatar.png"
                      alt="Radovan SkillArena"
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-foreground">
                        Radovan SkillArena
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        Founder & CEO at Trophy
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="h-[32px] rounded-[4px] border border-input text-[13px] text-muted-foreground transition hover:border-primary hover:text-primary"
                    >
                      Ignore
                    </button>
                    <button
                      type="button"
                      className="h-[32px] rounded-[4px] bg-primary text-[13px] font-medium text-primary-foreground transition hover:bg-primary/90"
                    >
                      Follow
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Your Friends */}
              <Card className="rounded-[6px] border-transparent bg-card shadow-none">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-foreground">Your Friends</h3>
                    <button type="button" className="text-[11px] font-medium text-primary">
                      See All
                    </button>
                  </div>

                  <div className="relative mb-5">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="input search text"
                      className={cn(
                        'h-10 w-full rounded-full border pl-11 pr-4 text-sm outline-none',
                        'border-input bg-muted text-foreground placeholder:text-muted-foreground'
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    {friends.map((friend, index) => (
                      <div key={`${friend.name}-${index}`} className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <Image
                            src={friend.image}
                            alt={friend.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-medium text-foreground">
                              {friend.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {friend.title}
                            </p>
                          </div>
                        </div>

                        {friend.online ? (
                          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
                        ) : (
                          <span className="text-[11px] text-muted-foreground">{friend.status}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Dark/light mode toggle pill ── */}
      <div className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 xl:block">
        <ThemeToggle />
      </div>
    </div>
  )
}
