import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PastActivityCard } from '@/components/ui/pastActivityCard'
import { Navbar } from '@/components/ui/navbar'
import { CurrentActivityCard } from '@/components/ui/currentActivityCard'

export default function ActivityPage() {
  return (
    <div id="app-container" className="flex flex-col gap-4 mb-16">
      <p className="text-h2">Your Activity</p>
      <Tabs defaultValue="CurrentBooking" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="CurrentBooking">Current Booking</TabsTrigger>
          <TabsTrigger value="PastHistory">Past History</TabsTrigger>
        </TabsList>

        <TabsContent value="CurrentBooking" className="flex flex-col gap-3">
          <div></div>
          <CurrentActivityCard
            variant="notdue"
            roomName="Room 303"
            placeName="Conference Center"
            date="28 Aug"
            time="1:00PM - 3:00PM"
          />
          <CurrentActivityCard
            variant="jonging"
            roomName="Room 101"
            placeName="Main Hall"
            timeLeft={3616} // 1 hour, 0 minutes, and 16 seconds
          />
          <CurrentActivityCard
            variant="checking"
            roomName="Room 202"
            placeName="Library"
            timeLeft={452} // 7 minutes and 32 seconds
          />
        </TabsContent>

        <TabsContent value="PastHistory" className="flex flex-col gap-3">
          <PastActivityCard
            status={['checkinLate', 'checkoutLate']}
            roomName="Room 303"
            placeName="Conference Center"
            date="15 Aug"
            time="1PM - 3PM"
          />
          <PastActivityCard
            status={['checkin', 'checkout']}
            roomName="Room 303"
            placeName="Conference Center"
            date="15 Aug"
            time="1PM - 3PM"
          />
          <PastActivityCard
            status={['cancelled']}
            roomName="Room 303"
            placeName="Conference Center"
            date="15 Aug"
            time="1PM - 3PM"
          />
        </TabsContent>
      </Tabs>
      <Navbar />
    </div>
  )
}
