'use client'

import React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  onClose?: () => void
  className?: string
}

export function Toast({ type, message, onClose, className }: ToastProps) {
  const variants = {
    success: {
      bg: 'bg-green-50 dark:bg-green-950',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-100',
      icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-100',
      icon: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-100',
      icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-950',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-100',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
    },
  }

  const variant = variants[type]

  return (
    <div
      className={cn(
        `flex items-center gap-3 rounded-lg border p-4 ${variant.bg} ${variant.border}`,
        className
      )}
    >
      {variant.icon}
      <p className={`flex-1 text-sm font-medium ${variant.text}`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-2 opacity-70 hover:opacity-100 ${variant.text}`}
        >
          ✕
        </button>
      )}
    </div>
  )
}
