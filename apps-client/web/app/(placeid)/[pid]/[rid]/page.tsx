'use client'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { JongPopup } from '@/components/ui/jongPopup'
import { TimeBox } from '@/components/ui/timeBox'
import { TimeDivider } from '@/components/ui/timeDivider'
import { useToast } from '@/hooks/use-toast'
import { processBookings } from '@/lib/time'
import { ArrowLeft, CaretLeft, CaretRight, Skull, User } from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function RoomDetailPage({ params }: { params: { rid: string; pid: string } }) {
  const { toast } = useToast()
  const { pid, rid } = params
  const [popupOpen, setPopupOpen] = useState(false)

  const handleConfirm = () => {
    console.log('Confirmed!')
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

  const { data: places } = useQuery<{
    places: {
      id: string
      name: string
      open: string
      close: string
      availableCount: number
    }[]
  }>({
    queryKey: [`room/place`],
  })

  const { data } = useQuery<{
    bookings: {
      bookingId: string
      userId: string
      checkIn: string // ISO string
      checkOut: string // ISO string
    }[]
  }>({
    queryKey: [`booking/room/${rid}`],
  })
  const [displayDate, setDisplayDate] = useState(new Date())
  const place = places?.places.find((place) => place.id === pid)
  const slot = processBookings(
    (data?.bookings ?? []).filter(({ checkIn }) => {
      return new Date(checkIn).getDate() === displayDate.getDate()
    }) ?? [],
    place?.open ?? '10:00 AM',
    place?.close ?? '10:00 PM'
  )

  const goBack = () => {
    setDisplayDate((prev) => addDays(prev, -1))
  }

  const goForward = () => {
    setDisplayDate((prev) => addDays(prev, 1))
  }

  const router = useRouter()

  const { data: isPenalized } = useQuery<boolean>({
    queryKey: [`penalty`],
  })

  console.log(isPenalized)

  return (
    <div id="app-container" className="h-max bg-mustard flex flex-col gap-4">
      <JongPopup
        open={popupOpen}
        onOpenChange={setPopupOpen}
        title="Jong this hong"
        description=""
        confirmLabel="Confirm"
        onConfirm={({ date, startTime, endTime }) => {
          fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/booking/book`, {
            method: 'POST',
            body: JSON.stringify({
              roomId: rid,
              checkIn: new Date(`${date} ${startTime}`).toISOString(),
              checkOut: new Date(`${date} ${endTime}`).toISOString(),
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }).then((res) => {
            if (res.ok) {
              toast({
                title: 'Booking successful',
                description: 'Your booking has been confirmed.',
              })
              router.push('/')
            } else {
              toast({
                title: 'Booking fail',
                variant: 'destructive',
              })
            }
          })
          setPopupOpen(false)
        }}
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
        <div className=" self-stretch space-y-2 max-h-[calc(100vh-380px)] overflow-scroll">
          {slot.map((slot, index) => {
            if (slot.type === 'separator') {
              return <TimeDivider key={index} time={slot.label} />
            }
            return (
              <TimeBox
                key={index}
                variant={slot.status as 'booked' | 'available' | null | undefined}
                style={{
                  height: 100 * slot.length,
                }}
              />
            )
          })}
        </div>
      </div>
      {isPenalized ? (
        <div className="flex flex-row justify-start items-center gap-2 py-2 px-4 rounded-3xl border-2 border-black bg-white h-10 self-stretch">
          <Skull size={24} weight="bold" className="text-orange" />
          <p className="text-h4 text-orange">Penalty Period</p>
        </div>
      ) : (
        <Button onClick={() => setPopupOpen(true)} className="self-stretch">
          Jong This Hong
        </Button>
      )}
    </div>
  )
}
