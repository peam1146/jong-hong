'use client'
import { Suspense } from 'react'
import { QrReader } from 'react-qr-reader'

import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
function QrScanPage() {
  const { toast } = useToast()

  // Handle successful QR code scan
  const handleScan = (data: string | null) => {
    if (data) {
      console.log(data)
      fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/booking/checkin/${data}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(() => {
        toast({
          title: 'Check in Success',
          description: 'You have successfully checked in',
        })
        window.location.href = '/activity'
      })
    }
  }

  return (
    <div className="flex flex-col items-start min-h-screen bg-mustard">
      <div className="flex flex-col relative p-6 gap-2">
        <Link href="/">
          <div className="bg-white rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center">
            <ArrowLeft size={32} weight="bold" />
          </div>
        </Link>
        <h1 className="text-h2">Check in</h1>
        <p className="text-h5 text-center text-black">By scanning QR in front of the room</p>
      </div>
      <div className="w-full overflow-hidden">
        <QrReader
          onResult={(result) => {
            if (result) {
              handleScan(result.getText())
            }
          }}
          constraints={{}}
        />
      </div>

      <div className=" px-4 py-2 bg-white border-black border-2 text-gray-800 rounded-3xl self-center">
        <p>Waiting for QR code...</p>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <QrScanPage />
    </Suspense>
  )
}
