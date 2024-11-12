'use client'

import { useEffect } from 'react'

import { useAuthContext } from '@/components/provider/auth'
import { Navbar } from '@/components/ui/navbar'
import { PlaceCard } from '@/components/ui/placeCard'
import { useToast } from '@/hooks/use-toast'
import { SignOut, Skull } from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const { setToken } = useAuthContext()

  useEffect(() => {
    if (!searchParams.has('token')) return
    const token = searchParams.get('token')
    setToken(token!)
  }, [searchParams, toast, setToken])

  const { data: profile } = useQuery<{
    name: string
  }>({
    queryKey: [`auth/profile`],
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

  return (
    <>
      <div id="app-container" className="flex flex-col items-start gap-4 mb-14">
        <div className="flex flex-start gap-1 self-stretch pt-3">
          <div className="flex flex-col items-start flex-1">
            <div className="flex space-x-1">
              <p className="text-h3 text-orange">Sawasdee</p>
              <p className="text-h3 text-Black truncate text-ellipsis w-40">{profile?.name}</p>
            </div>
            <p className="text-h2">Let&apos;s Jong Hong !</p>
          </div>
          <button
            onClick={() => {
              setToken(null)
            }}
            className="bg-green rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center px-2 py-2"
          >
            <SignOut size={32} weight="bold" />
          </button>
        </div>
        <div className="flex flex-row justify-start items-center gap-2 py-2 px-4 rounded-3xl border-2 border-black bg-white h-10 self-stretch">
          <Skull size={24} weight="bold" className="text-orange" />
          <p className="text-h4 text-orange">Penalty Period</p>
          <p className="text-h4 text-Black">Until 17 May</p>
        </div>
        <div className="flex flex-col gap-5 self-stretch">
          {places?.places.map((place) => (
            <PlaceCard
              id={place.id}
              key={place.id}
              bgColor={
                place.availableCount > 5 ? 'green' : place.availableCount > 2 ? 'yellow' : 'pink'
              }
              name={place.name}
              numberOfPeople="1 - 10"
              time={`${place.open} - ${place.close}`}
              status={`${place.availableCount} hongs ready to jong`}
            />
          ))}
        </div>
      </div>
      <Navbar />
    </>
  )
}
