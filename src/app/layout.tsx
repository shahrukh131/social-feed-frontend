import type { Metadata } from 'next'
import { Providers } from './providers'
// @ts-ignore: Allow side-effect import for CSS without type declarations
import './globals.css'

export const metadata: Metadata = {
  title: 'Social Feed',
  description: 'A modern social feed application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
