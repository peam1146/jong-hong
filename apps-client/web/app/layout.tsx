'use client'

import './globals.css'

import { Suspense, useEffect, useState } from 'react'

import { AuthProvider } from '@/components/provider/auth'
import { Toaster } from '@/components/ui/toaster'
import { QueryClient, QueryClientProvider, QueryFunction, QueryKey } from '@tanstack/react-query'
import localFont from 'next/font/local'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const visby = localFont({
  src: './fonts/Visby Round CF Bold.woff2',
})

const defaultQueryFn: QueryFunction<unknown, QueryKey, never> = async ({ queryKey }) => {
  const searchParams =
    queryKey.length > 1
      ? `?${new URLSearchParams(queryKey[1] as Record<string, string>).toString()}`
      : ''
  const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/${queryKey[0]}${searchParams}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return res.json()
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
})

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const hasToken = useSearchParams().has('token')
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setToken(localStorage.getItem('token'))
    } else if (pathname !== '/signin' && !hasToken) {
      router.replace('/signin')
    }
  }, [router, pathname, hasToken])
  return (
    <html lang="en">
      <body className={`${visby.className}`}>
        <AuthProvider
          value={{
            token,
            setToken(token: string | null) {
              if (token === null) {
                localStorage.removeItem('token')
                router.replace('/signin')
              } else {
                localStorage.setItem('token', token)
              }
              setToken(token)
            },
          }}
        >
          {(token || hasToken || pathname == '/signin') && (
            <QueryClientProvider client={queryClient}>
              {children} <Toaster />
            </QueryClientProvider>
          )}
        </AuthProvider>
      </body>
    </html>
  )
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense>
      <RootLayout>{children}</RootLayout>
    </Suspense>
  )
}
