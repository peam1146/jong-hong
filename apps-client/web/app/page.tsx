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

      {/* <div className="container mx-auto py-12">
        <h1>Colors</h1>
        <div className="grid grid-cols-2 gap-4 w-fit">
          <div className="border-2 border-black w-24 h-14 bg-yellow rounded-xl"></div>
          <p>Yellow</p>
          <div className="border-2 border-black w-24 h-14 bg-mustard rounded-xl"></div>
          <p>Mustard</p>
          <div className="border-2 border-black w-24 h-14 bg-cream rounded-xl"></div>
          <p>Cream</p>
          <div className="border-2 border-black w-24 h-14 bg-pink rounded-xl"></div>
          <p>Pink</p>
          <div className="border-2 border-black w-24 h-14 bg-orange rounded-xl"></div>
          <p>Orange</p>
          <div className="border-2 border-black w-24 h-14 bg-peach rounded-xl"></div>
          <p>Peach</p>
          <div className="border-2 border-black w-24 h-14 bg-green rounded-xl"></div>
          <p>Green</p>
          <div className="border-2 border-black w-24 h-14 bg-black rounded-xl"></div>
          <p>Black</p>
          <div className="border-2 border-black w-24 h-14 bg-white rounded-xl"></div>
          <p>White</p>
        </div>
        <div className="">
          <p className="text-h1">H1 48px</p>
          <p className="text-h2">H2 32px</p>
          <p className="text-h3">H3 24px</p>
          <p className="text-h4">H4 20px</p>
          <p className="text-h5">H5 16px</p>
        </div>
        <div className="w-[300px] pt-12 space-y-2">
          <Input icon={<User color="black" weight="bold" />} />
          <Input placeholder="test" icon={<User color="black" weight="bold" />} />
        </div>
        <div className="pt-12">
          <Button>Button</Button>
          <Button size="sm">Button</Button>
        </div>
        <div className="pt-12">
          <Tabs defaultValue="CurrentBooking" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="CurrentBooking">Current Booking</TabsTrigger>
              <TabsTrigger value="PastHistory">Past History</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="pt-12">
          <Button
            onClick={() => {
              toast({
                title: 'Scheduled: Catch up',
              })
            }}
            size={'sm'}
          >
            Toast Green
          </Button>
          <Button
            onClick={() => {
              toast({
                title: 'Scheduled: Catch up',
                variant: 'destructive',
              })
            }}
            size={'sm'}
          >
            Toast Orange
          </Button>
        </div>
        <div className="pt-12">
          <Tag>Tag</Tag>
          <Tag variant="fail">Tag</Tag>
        </div>
      </div> */}
    </>
  )
}
