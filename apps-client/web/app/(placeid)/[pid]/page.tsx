'use client'
import { Clock, ArrowLeft, Funnel } from '@phosphor-icons/react/dist/ssr'
import { RoomCard } from '@/components/ui/roomCard'
import { FilterPopup } from '@/components/ui/filterPopup'
import { useState } from 'react'
import Link from 'next/link'

export default function PlaceDetailPage({ params }: { params: { pid: string } }) {
  const [popupOpen, setPopupOpen] = useState(false)

  const handleConfirm = () => {
    console.log('Confirmed!')
    setPopupOpen(false)
  }

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
        <div
          onClick={() => setPopupOpen(true)}
          className="bg-white rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center px-2 py-2 absolute right-4 top-4"
        >
          <Funnel size={32} weight="bold" />
        </div>
        <p className="text-h2">ENG Library @EN3</p>
        <div className="flex items-center gap-2">
          <Clock size={20} weight="bold" />
          <p className="text-h4">9AM - 4PM</p>
        </div>
      </div>
      <div id="app-container" className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <RoomCard name="211" numberOfPeople="1 - 10" />
          <RoomCard name="212" numberOfPeople="1 - 10" />
        </div>
        <div className="flex flex-row gap-4">
          <RoomCard name="213" numberOfPeople="1 - 10" />
          <RoomCard name="214" numberOfPeople="1 - 10" />
        </div>
        <div className="flex flex-row gap-4">
          <RoomCard name="215" numberOfPeople="1 - 10" />
          <RoomCard name="216" numberOfPeople="1 - 10" />
        </div>
      </div>
    </div>
  )
}
