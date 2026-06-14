'use client'

import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  FileText,
  Heart,
  ImageIcon,
  MessageCircle,
  RefreshCw,
  Send,
  Settings,
  Share2,
  Users,
  Video,
} from 'lucide-react'
import { Header } from '@/components/Header'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Toast } from '@/components/Toast'
import { useAuthContext } from '@/auth/auth-context'
import { APP_ROUTES } from '@/constants'
import { postsService } from '@/services/posts.service'
import type { PaginatedResponse, Post } from '@/types'
import { formatDate, getInitials } from '@/lib/utils'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700', '800'],
})

const storyItems = [
  {
    type: 'self',
    name: 'Your Story',
    image: '/assets/images/card_ppl1.png',
  },
  {
    type: 'public',
    name: 'Ryan Roslansky',
    image: '/assets/images/card_ppl2.png',
  },
  {
    type: 'public',
    name: 'Dylan Field',
    image: '/assets/images/card_ppl3.png',
  },
  {
    type: 'public',
    name: 'Steve Jobs',
    image: '/assets/images/card_ppl4.png',
  },
] as const

const suggestedPeople = [
  {
    name: 'Steve Jobs',
    role: 'CEO of Apple',
    image: '/assets/images/people1.png',
  },
  {
    name: 'Ryan Roslansky',
    role: 'CEO of Linkedin',
    image: '/assets/images/people2.png',
  },
  {
    name: 'Dylan Field',
    role: 'CEO of Figma',
    image: '/assets/images/people3.png',
  },
]

const eventCards = [
  {
    title: 'No more terrorism no more cry',
    date: '10',
    month: 'Jul',
    people: '17 People Going',
  },
  {
    title: 'Design systems meetup and product talk',
    date: '18',
    month: 'Jul',
    people: '24 People Going',
  },
]

const peopleStatus = [
  {
    name: 'Steve Jobs',
    role: 'CEO of Apple',
    image: '/assets/images/people1.png',
    status: '5 minute ago',
    active: false,
  },
  {
    name: 'Ryan Roslansky',
    role: 'CEO of Linkedin',
    image: '/assets/images/people2.png',
    status: 'online',
    active: true,
  },
  {
    name: 'Dylan Field',
    role: 'CEO of Figma',
    image: '/assets/images/people3.png',
    status: 'online',
    active: true,
  },
]

export default function FeedPage() {
  const { user } = useAuthContext()
  const [posts, setPosts] = useState<Post[]>([])
  const [postContent, setPostContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

  const greetingName = useMemo(() => user?.fullName?.split(' ')[0] || 'there', [user?.fullName])

  const loadFeed = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      setErrorMessage(null)
      const response = await postsService.getFeed(1, 20)
      const feedItems = Array.isArray((response as PaginatedResponse<Post>).data)
        ? ((response as PaginatedResponse<Post>).data ?? [])
        : []

      setPosts(feedItems)
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Unable to load your feed right now.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
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
      } else {
        await loadFeed(true)
      }

      setPostContent('')
      setToast({ type: 'success', message: 'Your post is live.' })
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
    <div className={`min-h-screen bg-[#f5f8fc] text-slate-900 ${poppins.className}`}>
      <Header />

      <main className="mx-auto max-w-[1380px] px-4 pb-8 pt-6 lg:px-6">
        {toast && (
          <div className="mx-auto mb-4 max-w-3xl">
            <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-6">
                <Card className="rounded-[6px] border-0 bg-white shadow-[0px_4px_16px_rgba(240,242,245,1)]">
                  <CardContent className="p-6">
                    <ul className="space-y-3 text-[15px] text-slate-600">
                      <li>
                        <Link
                          href={APP_ROUTES.FEED}
                          className="flex items-center gap-3 rounded-md bg-[#1890ff14] px-3 py-2 font-medium text-[#1890FF]"
                        >
                          <Users className="h-4 w-4" />
                          Feed
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={APP_ROUTES.PROFILE(user?.id || '')}
                          className="flex items-center gap-3 px-3 py-2 transition hover:text-[#1890FF]"
                        >
                          <ImageIcon className="h-4 w-4" />
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={APP_ROUTES.SETTINGS}
                          className="flex items-center gap-3 px-3 py-2 transition hover:text-[#1890FF]"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="flex items-center gap-3 px-3 py-2 text-left transition hover:text-[#1890FF]"
                        >
                          <FileText className="h-4 w-4" />
                          Save post
                        </button>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="rounded-[6px] border-0 bg-white shadow-[0px_4px_16px_rgba(240,242,245,1)]">
                  <CardContent className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-900">Suggested People</h3>
                      <button type="button" className="text-sm text-[#1890FF]">
                        See All
                      </button>
                    </div>

                    <div className="space-y-5">
                      {suggestedPeople.map((person) => (
                        <div key={person.name} className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <Image
                              src={person.image}
                              alt={person.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-900">
                                {person.name}
                              </p>
                              <p className="truncate text-xs text-slate-500">{person.role}</p>
                            </div>
                          </div>
                          <button type="button" className="text-sm text-[#1890FF]">
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[6px] border-0 bg-white shadow-[0px_4px_16px_rgba(240,242,245,1)]">
                  <CardContent className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-900">Events</h3>
                      <button type="button" className="text-sm text-[#1890FF]">
                        See all
                      </button>
                    </div>

                    <div className="space-y-4">
                      {eventCards.map((event) => (
                        <div
                          key={event.title}
                          className="overflow-hidden rounded-[6px] border border-slate-100"
                        >
                          <Image
                            src="/assets/images/feed_event1.png"
                            alt={event.title}
                            width={320}
                            height={160}
                            className="h-32 w-full object-cover"
                          />
                          <div className="p-4">
                            <div className="flex gap-3">
                              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md bg-sky-50 text-[#1890FF]">
                                <span className="text-base font-semibold">{event.date}</span>
                                <span className="text-xs font-medium">{event.month}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium leading-5 text-slate-900">
                                  {event.title}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                              <span className="text-xs text-slate-500">{event.people}</span>
                              <button type="button" className="text-sm text-[#1890FF]">
                                Going
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
          </aside>

          <section className="min-w-0">
              <div className="mb-4 flex items-center justify-between rounded-[6px] bg-white px-5 py-4 shadow-[0px_4px_16px_rgba(240,242,245,1)]">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#1890FF]">Social Feed</p>
                  <h1 className="mt-1 text-xl font-semibold text-slate-900">
                    Welcome back, {greetingName}
                  </h1>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void loadFeed(true)}
                  disabled={isRefreshing}
                  className="border-slate-200 text-slate-700"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              <div className="mb-4 hidden grid-cols-4 gap-4 md:grid">
                {storyItems.map((story) => (
                  <div
                    key={`${story.type}-${story.name}`}
                    className="relative overflow-hidden rounded-[6px] shadow-[0px_4px_16px_rgba(240,242,245,1)]"
                  >
                    <Image
                      src={story.image}
                      alt={story.name}
                      width={220}
                      height={280}
                      className="h-[180px] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/45" />
                    {story.type === 'self' ? (
                      <div className="absolute inset-x-0 bottom-0 rounded-t-[26px] bg-[#112032] pt-7">
                        <button
                          type="button"
                          className="absolute left-1/2 top-0 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#112032] bg-[#1890FF]"
                        >
                          <span className="text-lg leading-none text-white">+</span>
                        </button>
                        <p className="pb-2 text-center text-xs font-medium text-white">
                          {story.name}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="absolute right-3 top-3">
                          <Image
                            src="/assets/images/mini_pic.png"
                            alt=""
                            width={28}
                            height={28}
                            className="h-7 w-7 rounded-full border-2 border-white"
                          />
                        </div>
                        <p className="absolute inset-x-0 bottom-3 text-center text-xs font-medium text-white">
                          {story.name}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="mb-4 flex gap-3 overflow-x-auto md:hidden">
                {storyItems.map((story) => (
                  <div key={story.name} className="min-w-[82px] text-center">
                    <div className="relative mx-auto h-[74px] w-[74px] overflow-hidden rounded-[20px]">
                      <Image
                        src={
                          story.type === 'self'
                            ? '/assets/images/mobile_story_img.png'
                            : story.name === 'Ryan Roslansky'
                              ? '/assets/images/mobile_story_img1.png'
                              : '/assets/images/mobile_story_img2.png'
                        }
                        alt={story.name}
                        width={74}
                        height={74}
                        className="h-full w-full object-cover"
                      />
                      {story.type === 'self' && (
                        <button
                          type="button"
                          className="absolute left-1/2 top-full flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#1890FF] text-sm text-white"
                        >
                          +
                        </button>
                      )}
                    </div>
                    <p className="mt-3 truncate text-xs font-medium text-slate-700">{story.name}</p>
                  </div>
                ))}
              </div>

              <Card className="mb-4 rounded-[6px] border-0 bg-white shadow-[0px_4px_16px_rgba(240,242,245,1)]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Image
                      src="/assets/images/txt_img.png"
                      alt="Current user"
                      width={40}
                      height={40}
                      className="mt-1 h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="relative">
                        <Textarea
                          value={postContent}
                          onChange={(event) => setPostContent(event.target.value)}
                          placeholder="Write something ..."
                          rows={4}
                          className="min-h-[88px] border-0 p-2 text-base shadow-none focus-visible:ring-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-4 rounded-b-[6px] bg-[#1890ff0d] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-1 text-sm text-slate-600">
                      {[
                        { icon: ImageIcon, label: 'Photo' },
                        { icon: Video, label: 'Video' },
                        { icon: CalendarDays, label: 'Event' },
                        { icon: FileText, label: 'Article' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          className="inline-flex items-center gap-2 rounded-md px-3 py-2 transition hover:text-[#1890FF]"
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
                      className="h-11 rounded-[6px] bg-[#1890FF] px-6 hover:bg-[#377DFF]"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isPosting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 2 }).map((_, index) => (
                    <Card
                      key={index}
                      className="rounded-[6px] border-0 bg-white shadow-[0px_4px_16px_rgba(240,242,245,1)]"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                          </div>
                        </div>
                        <div className="mt-5 h-4 w-full animate-pulse rounded bg-slate-100" />
                        <div className="mt-3 h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                        <div className="mt-5 h-52 animate-pulse rounded-[6px] bg-slate-100" />
                      </CardContent>
                    </Card>
                  ))
                ) : errorMessage ? (
                  <Card className="rounded-[6px] border-0 bg-white shadow-[0px_4px_16px_rgba(240,242,245,1)]">
                    <CardContent className="p-10 text-center">
                      <p className="text-lg font-medium text-slate-900">Could not load your feed</p>
                      <p className="mt-2 text-sm text-slate-500">{errorMessage}</p>
                      <Button className="mt-5 bg-[#1890FF] hover:bg-[#377DFF]" onClick={() => void loadFeed()}>
                        Try again
                      </Button>
                    </CardContent>
                  </Card>
                ) : posts.length === 0 ? (
                  <Card className="rounded-[6px] border-0 bg-white shadow-[0px_4px_16px_rgba(240,242,245,1)]">
                    <CardContent className="p-10 text-center">
                      <p className="text-lg font-medium text-slate-900">No posts yet</p>
                      <p className="mt-2 text-sm text-slate-500">
                        Start the conversation by sharing your first update.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post, index) => (
                    <Card
                      key={post.id}
                      className="rounded-[6px] border-0 bg-white shadow-[0px_4px_16px_rgba(240,242,245,1)]"
                    >
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-11 w-11">
                              <AvatarFallback className="bg-slate-100 text-slate-700">
                                {getInitials(post.author?.fullName || 'User')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-base font-normal text-slate-900">
                                {post.author?.fullName || 'Unknown user'}
                              </p>
                              <p className="text-sm text-slate-500">
                                @{post.author?.username || 'username'} ·{' '}
                                <Link href={APP_ROUTES.PROFILE(post.author?.id || '')}>Follow</Link>
                              </p>
                            </div>
                          </div>
                          <button type="button" className="px-1 text-slate-400">
                            •••
                          </button>
                        </div>

                        <p className="mb-4 whitespace-pre-wrap text-sm leading-6 text-slate-900">
                          {post.content}
                        </p>

                        {post.image ? (
                          <div className="mb-5 overflow-hidden rounded-[6px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={post.image}
                              alt="Post attachment"
                              className="h-auto w-full object-cover"
                            />
                          </div>
                        ) : index === 0 ? (
                          <div className="mb-5 overflow-hidden rounded-[6px]">
                            <Image
                              src="/assets/images/timeline_img.png"
                              alt="Timeline placeholder"
                              width={860}
                              height={420}
                              className="h-auto w-full object-cover"
                            />
                          </div>
                        ) : null}

                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <Image
                                src="/assets/images/react_img1.png"
                                alt=""
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-full border border-white"
                              />
                              <Image
                                src="/assets/images/react_img2.png"
                                alt=""
                                width={32}
                                height={32}
                                className="-ml-4 h-8 w-8 rounded-full border border-white"
                              />
                              <Image
                                src="/assets/images/react_img3.png"
                                alt=""
                                width={32}
                                height={32}
                                className="-ml-4 h-8 w-8 rounded-full border border-white"
                              />
                              <div className="-ml-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#1890FF] text-xs text-white">
                                {Math.min(post.likes, 99)}
                              </div>
                            </div>
                            <p className="text-sm text-slate-500">You and others reacted</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>
                              <span className="text-slate-700">{post.comments}</span> Comment
                            </span>
                            <span>
                              <span className="text-slate-700">{post.likes}</span> Like
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 bg-[#fbfcfd] p-2">
                          <button
                            type="button"
                            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[6px] text-sm transition hover:bg-[#e4f1fd]"
                          >
                            <Heart className="h-4 w-4" />
                            Like
                          </button>
                          <button
                            type="button"
                            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[6px] text-sm transition hover:bg-[#e4f1fd]"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Comment
                          </button>
                          <button
                            type="button"
                            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[6px] text-sm transition hover:bg-[#e4f1fd]"
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </button>
                        </div>

                        <div className="pt-5">
                          <div className="rounded-[18px] bg-[#f6f6f6] px-3 py-2">
                            <div className="flex items-center gap-3">
                              <Image
                                src="/assets/images/comment_img.png"
                                alt=""
                                width={26}
                                height={26}
                                className="h-[26px] w-[26px] rounded-full"
                              />
                              <input
                                type="text"
                                placeholder="Write a comment"
                                className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 text-xs text-slate-400">{formatDate(post.createdAt)}</div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
          </section>

          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-6">
                <Card className="rounded-[6px] border-0 bg-white shadow-[0px_4px_16px_rgba(240,242,245,1)]">
                  <CardContent className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-900">You Might Like</h3>
                      <button type="button" className="text-sm text-[#1890FF]">
                        See All
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Image
                          src="/assets/images/Avatar.png"
                          alt="Radovan SkillArena"
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            Radovan SkillArena
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            Founder & CEO at Trophy
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        className="flex-1 rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600"
                      >
                        Ignore
                      </button>
                      <button
                        type="button"
                        className="flex-1 rounded-md bg-[#1890FF] px-4 py-2 text-sm text-white"
                      >
                        Follow
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[6px] border-0 bg-white shadow-[0px_4px_16px_rgba(240,242,245,1)]">
                  <CardContent className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-900">Your Friends</h3>
                      <button type="button" className="text-sm text-[#1890FF]">
                        See All
                      </button>
                    </div>

                    <div className="relative mb-5">
                      <input
                        type="text"
                        placeholder="input search text"
                        className="h-10 w-full rounded-md border border-slate-200 bg-transparent pl-10 pr-4 text-sm outline-none placeholder:text-slate-400"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        fill="none"
                        viewBox="0 0 17 17"
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                      >
                        <circle cx="7" cy="7" r="6" stroke="#666" />
                        <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                      </svg>
                    </div>

                    <div className="space-y-2">
                      {peopleStatus.map((person) => (
                        <div
                          key={`${person.name}-${person.status}`}
                          className="flex items-center justify-between rounded-[6px] px-2 py-2 transition hover:bg-slate-50"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <Image
                              src={person.image}
                              alt={person.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-900">
                                {person.name}
                              </p>
                              <p className="truncate text-xs text-slate-500">{person.role}</p>
                            </div>
                          </div>

                          {person.active ? (
                            <span className="inline-flex h-3 w-3 rounded-full border-2 border-white bg-[#0ACF83]" />
                          ) : (
                            <span className="text-xs text-slate-400">{person.status}</span>
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
    </div>
  )
}
