'use client'

import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useRegister } from '@/hooks/useAuth'
import { APP_ROUTES } from '@/constants'
import { isValidEmail } from '@/lib/utils'
import { Toast } from '@/components/Toast'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700', '800'],
})

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(true)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
    acceptedTerms?: string
  }>({})
  const [alertMessage, setAlertMessage] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

  const router = useRouter()
  const { mutate: register, isPending } = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: typeof errors = {}
    const derivedFullName = email.trim().split('@')[0] || 'User'

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Repeat password is required'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!acceptedTerms) {
      newErrors.acceptedTerms = 'You must agree to the terms and conditions'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    register(
      { email, password, fullName: derivedFullName },
      {
        onSuccess: () => {
          setAlertMessage({ type: 'success', message: 'Account created! Redirecting...' })
          window.setTimeout(() => router.push(APP_ROUTES.FEED), 1000)
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || 'Registration failed. Please try again.'
          setAlertMessage({ type: 'error', message: errorMessage })
        },
      }
    )
  }

  return (
    <main
      className={`relative min-h-screen overflow-hidden ${poppins.className}`}
      style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #f0f4ff 100%)' }}
    >
      {/* ── Decorative background shapes (mirrors the HTML's _shape_one/two/three) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Shape One – top-left */}
        <div className="absolute left-0 top-0 z-0 hidden xl:block">
          <Image
            src="/assets/images/shape1.svg"
            alt=""
            width={280}
            height={280}
            className="h-auto w-full"
          />
          <Image
            src="/assets/images/dark_shape.svg"
            alt=""
            width={280}
            height={280}
            className="absolute left-0 top-0 h-auto w-full"
          />
        </div>

        {/* Shape Two – top-right */}
        <div className="absolute right-0 top-0 z-0 hidden xl:block">
          <Image
            src="/assets/images/shape2.svg"
            alt=""
            width={400}
            height={340}
            className="h-auto w-full"
          />
          <Image
            src="/assets/images/dark_shape1.svg"
            alt=""
            width={400}
            height={340}
            className="absolute right-0 top-0 h-auto w-full opacity-60"
          />
        </div>

        {/* Shape Three – bottom-right */}
        <div className="absolute bottom-0 right-80 z-0 hidden xl:block">
          <Image
            src="/assets/images/shape3.svg"
            alt=""
            width={340}
            height={300}
            className="h-auto w-full"
          />
          <Image
            src="/assets/images/dark_shape2.svg"
            alt=""
            width={340}
            height={300}
            className="absolute bottom-0 right-0 h-auto w-full opacity-60"
          />
        </div>
      </div>

      {/* ── Main layout container ── */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1520px] items-center px-4 py-8 sm:px-6 lg:px-10 xl:px-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[2fr_1fr] xl:gap-16">

          {/* ── Left column: illustration (col-xl-8 in HTML) ── */}
          <section className="hidden lg:flex lg:items-center lg:justify-center">
            <div className="relative w-full max-w-[800px]">
              {/* Light mode image */}
              <Image
                src="/assets/images/registration.png"
                alt="People interacting with a social application"
                width={1200}
                height={920}
                priority
                className="h-auto w-full object-contain"
              />
              {/* Dark mode image – hidden by default, shown in dark context */}
              <Image
                src="/assets/images/registration1.png"
                alt=""
                width={1200}
                height={920}
                className="absolute inset-0 hidden h-auto w-full object-contain"
              />
            </div>
          </section>

          {/* ── Right column: registration card (col-xl-4 in HTML) ── */}
          <section className="mx-auto w-full max-w-[352px]">
            <div
              className="rounded-[6px] bg-white px-10 py-10 shadow-[0_10px_32px_rgba(15,23,42,0.05)] md:px-10 md:py-12"
              style={{
                border: '1px solid rgba(226,232,240,0.9)',
              }}
            >
              {/* Logo */}
              <div className="mb-7 flex justify-center">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Buddy Script"
                  width={155}
                  height={40}
                  priority
                  className="h-auto w-auto"
                />
              </div>

              {/* Heading */}
              <p className="mb-2 text-center text-[15px] font-normal text-slate-800">
                Get Started Now
              </p>
              <h1 className="mb-10 text-center text-[2rem] font-semibold tracking-tight text-slate-900">
                Registration
              </h1>

              {/* Google register button */}
              <button
                type="button"
                className="mb-10 flex h-[38px] w-full items-center justify-center gap-2.5 rounded-[4px] border border-slate-200 bg-white px-5 text-[14px] font-medium text-slate-900 transition hover:border-[#1890FF] hover:bg-[#f7fbff]"
              >
                <Image src="/assets/images/google.svg" alt="" width={20} height={20} />
                <span>Register with google</span>
              </button>

              {/* Divider */}
              <div className="mb-10 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="min-w-8 text-center text-sm font-normal text-slate-400">Or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Toast alert */}
              {alertMessage && (
                <Toast
                  type={alertMessage.type}
                  message={alertMessage.message}
                  onClose={() => setAlertMessage(null)}
                  className="mb-5"
                />
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-[14px] text-left">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[14px] font-medium text-slate-800"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder=""
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-[38px] w-full rounded-[4px] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#1890FF] focus:ring-4 focus:ring-[#1890FF]/10"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[14px] font-medium text-slate-800"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder=""
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-[38px] w-full rounded-[4px] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#1890FF] focus:ring-4 focus:ring-[#1890FF]/10"
                  />
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Repeat Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-[14px] font-medium text-slate-800"
                  >
                    Repeat Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder=""
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-[38px] w-full rounded-[4px] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#1890FF] focus:ring-4 focus:ring-[#1890FF]/10"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms radio */}
                <div className="pt-1">
                  <label className="flex cursor-pointer items-center gap-2.5 text-[14px] text-slate-800">
                    <input
                      type="radio"
                      checked={acceptedTerms}
                      onChange={() => setAcceptedTerms(true)}
                      className="h-4 w-4 border-slate-300 text-[#1890FF] focus:ring-[#1890FF]"
                    />
                    <span>I agree to terms &amp; conditions</span>
                  </label>
                  {errors.acceptedTerms && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.acceptedTerms}</p>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-8 pb-10">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-[40px] w-full items-center justify-center rounded-[4px] bg-[#1890FF] px-5 text-[15px] font-semibold text-white transition hover:bg-[#0d7fe6] active:bg-[#0a6fd1] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? 'Creating account...' : 'Sign Up'}
                  </button>
                </div>
              </form>

      
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
