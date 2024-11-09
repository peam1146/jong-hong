import './globals.css'

import { Toaster } from '@/components/ui/toaster'
import { Navbar } from '@/components/ui/navbar'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

const visby = localFont({
  src: './fonts/Visby Round CF Bold.woff2',
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${visby.className}`}>
        {children} <Toaster />
      </body>
    </html>
  )
}
