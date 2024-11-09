'use client'
import { ArrowLeft, User, CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'
import { TimeDivider } from '@/components/ui/timeDivider'
import { TimeBox } from '@/components/ui/timeBox'
import { useState } from 'react'
import { JongPopup } from '@/components/ui/jongPopup'
export default function RoomDetailPage({ params }: { params: { rid: string } }) {
  const { rid } = params
  const [popupOpen, setPopupOpen] = useState(false)

  const handleConfirm = () => {
    console.log('Confirmed!')
    setPopupOpen(false)
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
      >
        {/* Optional custom content */}
      </JongPopup>
      <div className="bg-white rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center px-2 py-2">
        <ArrowLeft size={32} weight="bold" />
      </div>
      <div className="flex flex-col items-start">
        <p className="text-h2">Hong {rid}</p>
        <div className="flex items-center gap-2">
          <User size={20} weight="bold" />
          <p className="text-h4">1 - 10</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6 shrink-0 rounded-3xl border-2 border-black bg-cream p-6">
        <div className="flex flex-row self-stretch justify-between gap-2">
          <div className="bg-white rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center px-2 py-2">
            <CaretLeft size={32} weight="bold" />
          </div>
          <div className="bg-white rounded-3xl border-black border-2 flex items-center justify-center px-4 py-2 flex-1">
            <p className="text-h4">21 Aug 2024</p>
          </div>

          <div className="bg-white rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center px-2 py-2">
            <CaretRight size={32} weight="bold" />
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 self-stretch">
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
// export async function generateStaticParams() {
//   return [{ rid: '211' }]
// }
