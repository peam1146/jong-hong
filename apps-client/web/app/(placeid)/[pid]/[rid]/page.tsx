'use client'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { JongPopup } from '@/components/ui/jongPopup'
import { TimeBox } from '@/components/ui/timeBox'
import { TimeDivider } from '@/components/ui/timeDivider'
import { ArrowLeft, CaretLeft, CaretRight, User } from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import Link from 'next/link'
export default function RoomDetailPage({ params }: { params: { rid: string; pid: string } }) {
  const { pid, rid } = params
  const [popupOpen, setPopupOpen] = useState(false)

  const handleConfirm = () => {
    console.log('Confirmed!')
    setPopupOpen(false)
  }

  const { data: room } = useQuery<{
    id: string
    name: string
    minOccupancy: number
    maxOccupancy: number
    placeId: string
    available: boolean
  }>({
    queryKey: [`room/room/${rid}`],
  })

  const [displayDate, setDisplayDate] = useState(new Date())

  const goBack = () => {
    setDisplayDate((prev) => addDays(prev, -1))
  }

  const goForward = () => {
    setDisplayDate((prev) => addDays(prev, 1))
  }

  return (
    <div id="app-container" className="h-max bg-mustard flex flex-col gap-4">
      <JongPopup
        open={popupOpen}
        onOpenChange={setPopupOpen}
        title="Jong this hong"
        description=""
        confirmLabel="Confirm"
        onConfirm={handleConfirm}
      ></JongPopup>
      <Link
        href={`/${pid}`}
        className="bg-white rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center px-2 py-2"
      >
        <ArrowLeft size={32} weight="bold" />
      </Link>
      <div className="flex flex-col items-start">
        <p className="text-h2">Hong {room?.name}</p>
        <div className="flex items-center gap-2">
          <User size={20} weight="bold" />
          <p className="text-h4">
            {room?.minOccupancy} - {room?.maxOccupancy}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6 shrink-0 rounded-3xl border-2 border-black bg-cream p-6">
        <div className="flex flex-row self-stretch justify-between gap-2">
          <button
            onClick={goBack}
            className="bg-white rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center px-2 py-2"
          >
            <CaretLeft size={32} weight="bold" />
          </button>
          <div className="bg-white rounded-3xl border-black border-2 flex items-center justify-center px-4 py-2 flex-1">
            <p className="text-h4">{format(displayDate, 'dd MMM yyyy')}</p>
          </div>
          <button
            onClick={goForward}
            className="bg-white rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center px-2 py-2"
          >
            <CaretRight size={32} weight="bold" />
          </button>
        </div>
        <div className="flex flex-col items-start gap-2 self-stretch max-h-[calc(100vh-380px)] overflow-scroll">
          <TimeDivider time="10:30AM" />
          <TimeBox variant="booked" />
          <TimeDivider time="12:30AM" />
          <TimeBox variant="empty" />
          <TimeDivider time="14:30AM" />
          <TimeBox variant="booked" />
          <TimeDivider time="16:30AM" />
          <TimeDivider time="10:30AM" />
          <TimeBox variant="booked" />
          <TimeDivider time="12:30AM" />
          <TimeBox variant="empty" />
          <TimeDivider time="14:30AM" />
          <TimeBox variant="booked" />
          <TimeDivider time="16:30AM" />
          <TimeDivider time="10:30AM" />
          <TimeBox variant="booked" />
          <TimeDivider time="12:30AM" />
          <TimeBox variant="empty" />
          <TimeDivider time="14:30AM" />
          <TimeBox variant="booked" />
          <TimeDivider time="16:30AM" />
          <TimeDivider time="10:30AM" />
          <TimeBox variant="booked" />
          <TimeDivider time="12:30AM" />
          <TimeBox variant="empty" />
          <TimeDivider time="14:30AM" />
          <TimeBox variant="booked" />
          <TimeDivider time="16:30AM" />
        </div>
      </div>
      <Button onClick={() => setPopupOpen(true)} className="self-stretch">
        Jong This Hong
      </Button>
    </div>
  )
}
