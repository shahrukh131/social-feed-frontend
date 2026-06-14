'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={cn(
        'group relative flex h-[74px] w-[36px] items-center justify-center rounded-full border p-[4px] transition-all duration-300',
        'border-border bg-card shadow-[0_10px_24px_rgba(24,144,255,0.14)]',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
        'dark:shadow-[0_14px_30px_rgba(3,8,20,0.35)]'
      )}
    >
      <span
        className={cn(
          'absolute left-1/2 top-[4px] h-[30px] w-[30px] -translate-x-1/2 rounded-full transition-all duration-300',
          'bg-primary shadow-[0_10px_18px_rgba(24,144,255,0.25)]',
          isDark && 'translate-y-[36px] shadow-[0_10px_18px_rgba(24,144,255,0.38)]'
        )}
      />

      <span
        className={cn(
          'pointer-events-none absolute left-1/2 top-[11px] z-10 -translate-x-1/2 transition-colors duration-300',
          isDark ? 'text-white/55' : 'text-white'
        )}
      >
        <Sun className="h-[14px] w-[14px]" />
      </span>

      <span
        className={cn(
          'pointer-events-none absolute bottom-[11px] left-1/2 z-10 -translate-x-1/2 transition-colors duration-300',
          isDark ? 'text-white' : 'text-white/55'
        )}
      >
        <Moon className="h-[14px] w-[14px]" />
      </span>

      <span className="sr-only">{isDark ? 'Dark mode enabled' : 'Light mode enabled'}</span>
    </button>
  )
}
