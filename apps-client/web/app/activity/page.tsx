'use client'

import { Suspense, useEffect, useState } from 'react'

import { CurrentActivityCard } from '@/components/ui/currentActivityCard'
import { Navbar } from '@/components/ui/navbar'
import { PastActivityCard } from '@/components/ui/pastActivityCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import { useQuery } from '@tanstack/react-query'
import { addMinutes, format, isBefore } from 'date-fns'

function ActivityPage() {
  const { data, refetch } = useQuery<{
    bookings: {
      bookingId: string
      userId: string
      checkIn: string // ISO string
      checkOut: string // ISO string
      roomId: string
    }[]
  }>({
    queryKey: [`booking`],
  })

  const [roomAndPlace, setRoomAndPlace] = useState<
    {
      place: { id: string; name: string }
      rooms: { id: string; name: string }[]
    }[]
  >([])

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/room/place`)
      const data = (await res.json()) as { places: { id: string; name: string }[] }
      const roomAndPlace = []
      for (const place of data.places) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/room/place/${place.id}`)
        const data = (await res.json()) as { rooms: { id: string; name: string }[] }
        roomAndPlace.push({
          place,
          rooms: data.rooms,
        })
      }
      setRoomAndPlace(roomAndPlace)
    })()
  }, [])

  return (
    <div id="app-container" className="flex flex-col gap-4 mb-16">
      <p className="text-h2">Your Activity</p>
      <Tabs defaultValue="CurrentBooking" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="CurrentBooking">Current Booking</TabsTrigger>
          <TabsTrigger value="PastHistory">Past History</TabsTrigger>
        </TabsList>

        <TabsContent value="CurrentBooking" className="flex flex-col gap-3">
          {(data?.bookings ?? [])
            .filter((booking) => isBefore(new Date(booking.checkOut), new Date()) === false)
            .map((booking) => {
              const status = isBefore(new Date(), new Date(booking.checkIn))
                ? 'notdue'
                : isBefore(addMinutes(new Date(booking.checkIn), 15), new Date())
                  ? 'checking'
                  : 'jonging'

              const placeName = roomAndPlace.find((room) =>
                room.rooms.find((r) => r.id === booking.roomId)
              )?.place.name

              const roomName = roomAndPlace
                .find((room) => room.rooms.find((r) => r.id === booking.roomId))
                ?.rooms.find((r) => r.id === booking.roomId)?.name
              const time =
                status === 'jonging'
                  ? Math.floor((new Date(booking.checkOut).getTime() - new Date().getTime()) / 1000)
                  : status === 'checking'
                    ? Math.floor(
                        (new Date(booking.checkIn).getTime() - new Date().getTime()) / 1000
                      )
                    : undefined
              console.log(time)
              return (
                <CurrentActivityCard
                  key={booking.bookingId}
                  variant={status}
                  roomName={roomName ?? 'Room'}
                  placeName={placeName ?? 'Place'}
                  date={format(new Date(booking.checkIn), 'd MMM')}
                  time={`${format(new Date(booking.checkIn), 'h:mma')} - ${format(new Date(booking.checkOut), 'h:mma')}`}
                  timeLeft={time ? (time < 0 ? 0 : time) : undefined}
                  onCheckOut={async () => {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_GATEWAY_URL}/booking/cancel/${booking.bookingId}`,
                      {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                      }
                    )

                    if (res.ok) {
                      refetch()
                      toast({
                        title: 'Check out successful',
                        description: 'You have successfully checkout',
                      })
                    }
                  }}
                  onCanceled={async () => {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_GATEWAY_URL}/booking/cancel/${booking.bookingId}`,
                      {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                      }
                    )

                    if (res.ok) {
                      toast({
                        title: 'Booking canceled',
                        description: 'You have successfully canceled your booking',
                      })
                    }
                  }}
                />
              )
            })}
        </TabsContent>

        <TabsContent value="PastHistory" className="flex flex-col gap-3">
          {(data?.bookings ?? [])
            .filter((booking) => isBefore(new Date(booking.checkOut), new Date()) === true)
            .map((booking) => {
              const placeName = roomAndPlace.find((room) =>
                room.rooms.find((r) => r.id === booking.roomId)
              )?.place.name

              const roomName = roomAndPlace
                .find((room) => room.rooms.find((r) => r.id === booking.roomId))
                ?.rooms.find((r) => r.id === booking.roomId)?.name

              return (
                <PastActivityCard
                  status={['checkin', 'checkout']}
                  key={booking.bookingId}
                  roomName={roomName ?? 'Room'}
                  placeName={placeName ?? 'Place'}
                  date={format(new Date(booking.checkIn), 'd MMM')}
                  time={`${format(new Date(booking.checkIn), 'h:mma')} - ${format(new Date(booking.checkOut), 'h:mma')}`}
                />
              )
            })}
        </TabsContent>
      </Tabs>
      <Navbar />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <ActivityPage />
    </Suspense>
  )
}
