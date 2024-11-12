'use client'
import { useState } from 'react'

import { FilterPopup } from '@/components/ui/filterPopup'
import { RoomCard } from '@/components/ui/roomCard'
import { ArrowLeft, Clock, Funnel } from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function PlaceDetailPage({ params }: { params: { pid: string } }) {
  const [popupOpen, setPopupOpen] = useState(false)
  const [filter, setFilter] = useState({
    numberOfPeople: 1,
    date: '',
    startTime: '',
    endTime: '',
  })

  const handleConfirm = (filter: {
    numberOfPeople: number
    date: string
    startTime: string
    endTime: string
  }) => {
    setFilter(filter)
    setPopupOpen(false)
  }

  const { data: room } = useQuery<{
    id: string
    name: string
    open: string
    close: string
    availableCount: number
    rooms: {
      id: string
      name: string
      minOccupancy: number
      maxOccupancy: number
      placeId: string
      available: boolean
    }[]
  }>({
    queryKey: [`room/place/${params.pid}`, filter],
  })

  return (
    <div>
      <FilterPopup
        open={popupOpen}
        onOpenChange={setPopupOpen}
        title="Filter"
        description=""
        confirmLabel="Confirm"
        onConfirm={handleConfirm}
      >
        {/* Optional custom content */}
      </FilterPopup>
      <div className="bg-pink border-2 border-black rounded-bl-3xl rounded-br-3xl flex flex-col justify-end items-start px-6 py-6 h-[170px] relative">
        <Link href="/">
          <div className="bg-white rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center px-2 py-2 absolute left-4 top-4">
            <ArrowLeft size={32} weight="bold" />
          </div>
        </Link>
        <button
          onClick={() => setPopupOpen(true)}
          className="bg-white rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center px-2 py-2 absolute right-4 top-4"
        >
          <Funnel size={32} weight="bold" />
        </button>
        <p className="text-h2">{room?.name}</p>
        <div className="flex items-center gap-2">
          <Clock size={20} weight="bold" />
          <p className="text-h4">
            {room?.open} - {room?.close}
          </p>
        </div>
      </div>
      <div id="app-container" className="grid grid-cols-2 gap-4">
        {room?.rooms?.map((room) => (
          <RoomCard
            placeId={params.pid}
            key={room.id}
            id={room.id}
            name={room.name}
            numberOfPeople={`${room.minOccupancy} - ${room.maxOccupancy}`}
          />
        ))}
      </div>
    </div>
  )
}
