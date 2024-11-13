'use client'

import QRCode from 'react-qr-code'

import { useQuery } from '@tanstack/react-query'

export default function Home({ params }: { params: { rid: string } }) {
  const { data: room } = useQuery<{
    id: string
    name: string
    minOccupancy: number
    maxOccupancy: number
    placeId: string
    available: boolean
  }>({
    queryKey: [`room/room/${params.rid}`],
  })
  return (
    <div className="h-screen flex">
      <div className="m-auto space-y-4">
        <div className="text-2xl text-center w-full">Check In {room?.name}</div>
        <QRCode value={`${params.rid}-${new Date().toISOString()}`} />
      </div>
    </div>
  )
}
