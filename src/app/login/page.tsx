'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, type FieldErrors, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { useLogin } from '@/hooks/useAuth'
import { APP_ROUTES } from '@/constants'
import { Toast } from '@/components/Toast'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(true),
})

type LoginFormValues = z.infer<typeof loginSchema>

const loginResolver: Resolver<LoginFormValues> = async (values) => {
  const parsedValues = {
    email: values.email ?? '',
    password: values.password ?? '',
    rememberMe: values.rememberMe ?? true,
  }

  const result = loginSchema.safeParse(parsedValues)

  if (result.success) {
    return {
      values: result.data,
      errors: {},
    }
  }

  const errors = result.error.issues.reduce<FieldErrors<LoginFormValues>>((acc, issue) => {
    const field = issue.path[0]

    if (typeof field === 'string' && !acc[field as keyof LoginFormValues]) {
      acc[field as keyof LoginFormValues] = {
        type: issue.code,
        message: issue.message,
      }
    }

    return acc
  }, {})

  return {
    values: {},
    errors,
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { mutate: login, isPending } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: loginResolver,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  })

  const [alertMessage, setAlertMessage] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

  const onSubmit = (values: LoginFormValues) => {
    login(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          setAlertMessage({ type: 'success', message: 'Login successful! Redirecting...' })
          window.setTimeout(() => router.push(APP_ROUTES.FEED), 1000)
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message
          const errorMessage = Array.isArray(message)
            ? message[0]
            : message || 'Login failed. Please try again.'
          setAlertMessage({ type: 'error', message: errorMessage })
        },
      }
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f8fc] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/assets/images/shape1.svg"
          alt=""
          width={280}
          height={280}
          className="absolute left-0 top-0 w-40 opacity-90 md:w-56 xl:w-72"
        />
        <Image
          src="/assets/images/shape2.svg"
          alt=""
          width={240}
          height={240}
          className="absolute right-0 top-0 w-28 opacity-80 md:w-40 xl:w-52"
        />
        <Image
          src="/assets/images/shape3.svg"
          alt=""
          width={240}
          height={240}
          className="absolute bottom-0 right-0 w-32 opacity-90 md:w-44 xl:w-56"
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.3fr_0.9fr] xl:gap-16">
          <section className="relative hidden lg:block">
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute inset-x-12 top-10 -z-10 h-72 rounded-full bg-[#b9ddff] blur-3xl" />
              <Image
                src="/assets/images/login.png"
                alt="People connecting on the platform"
                width={900}
                height={760}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </section>

          <section className="mx-auto w-full max-w-[460px]">
            <div className="rounded-[32px] border border-white/80 bg-white/95 p-6 shadow-[0_25px_80px_rgba(24,144,255,0.12)] backdrop-blur md:p-8">
              <div className="mb-8">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Buddy Script"
                  width={172}
                  height={42}
                  className="h-auto w-auto"
                  priority
                />
              </div>

              <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#1890FF]">
                Welcome back
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Login to your account
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Stay close to your community, jump back into your feed, and pick up where you
                left off.
              </p>

              <button
                type="button"
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 transition hover:border-[#1890FF] hover:bg-[#f7fbff] hover:text-slate-900"
              >
                <Image src="/assets/images/google.svg" alt="" width={20} height={20} />
                <span>Or sign-in with Google</span>
              </button>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm font-medium text-slate-400">Or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {alertMessage && (
                <Toast
                  type={alertMessage.type}
                  message={alertMessage.message}
                  onClose={() => setAlertMessage(null)}
                  className="mb-5"
                />
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1890FF] focus:ring-4 focus:ring-[#1890FF]/10"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1890FF] focus:ring-4 focus:ring-[#1890FF]/10"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex cursor-pointer items-center gap-3 text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-[#1890FF] focus:ring-[#1890FF]"
                      {...register('rememberMe')}
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="text-left font-medium text-[#1890FF] transition hover:text-[#0d7fe6] sm:text-right"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#1890FF] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(24,144,255,0.28)] transition hover:bg-[#0d7fe6] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? 'Signing in...' : 'Login now'}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                Don&apos;t have an account?{' '}
                <Link
                  href={APP_ROUTES.REGISTER}
                  className="font-semibold text-[#1890FF] transition hover:text-[#0d7fe6]"
                >
                  Create New Account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
