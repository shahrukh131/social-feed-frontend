'use client'

import React from 'react'
import Link from 'next/link'
import { useAuthContext } from '@/auth/auth-context'
import { APP_ROUTES } from '@/constants'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

export function Header() {
  const { isAuthenticated, user, logout } = useAuthContext()

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href={APP_ROUTES.HOME} className="text-2xl font-bold text-blue-600">
          SocialFeed
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="cursor-pointer text-xs">
                      {getInitials(user?.fullName || 'User')}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-semibold">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={APP_ROUTES.FEED}>Feed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={APP_ROUTES.DASHBOARD}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`${APP_ROUTES.PROFILE(user?.id || '')}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={APP_ROUTES.SETTINGS}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href={APP_ROUTES.LOGIN} className={buttonVariants({ variant: 'outline' })}>
                Login
              </Link>
              <Link href={APP_ROUTES.REGISTER} className={buttonVariants()}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
