import { ReactNode, useState } from 'react'

import { Input } from '@/components/ui/input'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
interface PopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: (data: { date: string; startTime: string; endTime: string }) => void
  children?: ReactNode
}

export function JongPopup({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  children,
}: PopupProps) {
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-20" />
        <AlertDialog.Content className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-lg w-[320px] p-4 shadow-lg flex flex-col items-center gap-2">
            <AlertDialog.Title className="text-h3 font-semibold mb-2">{title}</AlertDialog.Title>
            {/* <AlertDialog.Description className="text-gray-700 mb-4">
              {description}
            </AlertDialog.Description> */}

            <Input
              onChange={(e) => setDate(e.target.value)}
              value={date}
              type="date"
              placeholder="Select date"
            />
            <div className="flex flex-row gap-3 items-center self-stretch">
              <Input
                onChange={(e) => setStartTime(e.target.value)}
                value={startTime}
                type="time"
                placeholder="Start"
              />
              <p className="text-h3">-</p>
              <Input
                onChange={(e) => setEndTime(e.target.value)}
                value={endTime}
                type="time"
                placeholder="End"
              />
            </div>
            {children}

            <div className="flex gap-4 mt-4">
              <AlertDialog.Cancel asChild>
                <button className="bg-gray-200 border-2 border-black rounded-3xl px-4 py-2">
                  {cancelLabel}
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={() => {
                    setDate('')
                    setStartTime('')
                    setEndTime('')
                    onConfirm({
                      date,
                      startTime,
                      endTime,
                    })
                  }}
                  className="bg-orange text-white border-2 border-black rounded-3xl px-4 py-2"
                >
                  {confirmLabel}
                </button>
              </AlertDialog.Action>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
