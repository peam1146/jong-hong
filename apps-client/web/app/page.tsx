'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tag } from '@/components/ui/tag'
import { useToast } from '@/hooks/use-toast'
import { User } from '@phosphor-icons/react/dist/ssr'
import { SignOut, Skull } from '@phosphor-icons/react/dist/ssr'
import { PlaceCard } from '@/components/ui/placeCard'
import { Navbar } from '@/components/ui/navbar'

export default function Home() {
  const { toast } = useToast()
  return (
    <>
      <div id="app-container" className="flex flex-col items-start gap-4 mb-14">
        <div className="flex flex-start gap-1 self-stretch pt-3">
          <div className="flex flex-col items-start flex-1">
            <div className="flex space-x-1">
              <p className="text-h3 text-orange">Sawasdee</p>
              <p className="text-h3 text-Black">Pimnut U.</p>
            </div>
            <p className="text-h2">Let's Jong Hong !</p>
          </div>
          <div className="bg-green rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center px-2 py-2">
            <SignOut size={32} weight="bold" />
          </div>
        </div>
        <div className="flex flex-row justify-start items-center gap-2 py-2 px-4 rounded-3xl border-2 border-black bg-white h-10 self-stretch">
          <Skull size={24} weight="bold" className="text-orange" />
          <p className="text-h4 text-orange">Penalty Period</p>
          <p className="text-h4 text-Black">Until 17 May</p>
        </div>
        <div className="flex flex-col gap-5 self-stretch">
          <PlaceCard
            bgColor="pink"
            name="ENG Library @EN3"
            numberOfPeople="1 - 10"
            time="8AM - 4PM"
            status="4 hongs ready to jong"
          />
          <PlaceCard
            bgColor="yellow"
            name="Sky Cafe @EN4 11th Floor"
            numberOfPeople="1 - 10"
            time="8AM - 4PM"
            status="No hongs now"
          />
          <PlaceCard
            bgColor="green"
            name="EN100 3rd Floor"
            numberOfPeople="1 - 10"
            time="8AM - 4PM"
            status="4 hongs ready to jong"
          />
        </div>
      </div>
      <Navbar />
    </>
  )
}
