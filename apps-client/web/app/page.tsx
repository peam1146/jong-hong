'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tag } from '@/components/ui/tag'
import { useToast } from '@/hooks/use-toast'
import { User } from '@phosphor-icons/react/dist/ssr'
export default function Home() {
  const { toast } = useToast()
  return (
    <div className="container mx-auto py-12">
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
    </div>
  )
}
