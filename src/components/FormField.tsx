'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/cn'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <Input
          ref={ref}
          className={cn(error && 'border-red-500', className)}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
      </div>
    )
  }
)
FormField.displayName = 'FormField'
