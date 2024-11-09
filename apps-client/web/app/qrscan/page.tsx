'use client'
import React, { useState } from 'react'
import { QrReader } from 'react-qr-reader'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
export default function QrScanPage() {
  const [qrData, setQrData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Handle successful QR code scan
  const handleScan = (data: string | null) => {
    if (data) {
      setQrData(data)
      setError(null) // Clear any previous errors
    }
  }

  // Handle errors in scanning process
  const handleError = (error: any) => {
    setError('Camera access failed or QR code not recognized')
    console.error(error)
  }

  const { toast } = useToast()

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
        <QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
      </div>

      {qrData ? (
        <div className=" px-4 py-2 bg-white border-black border-2 text-green-800 rounded-3xl self-center">
          <p>Check in Success</p>
        </div>
      ) : error ? (
        <div className="px-4 py-2 bg-white border-black border-2 text-red-800 rounded-3xl self-center">
          <p>{error}</p>
        </div>
      ) : (
        <div className=" px-4 py-2 bg-white border-black border-2 text-gray-800 rounded-3xl self-center">
          <p>Waiting for QR code...</p>
        </div>
      )}
    </div>
  )
}
