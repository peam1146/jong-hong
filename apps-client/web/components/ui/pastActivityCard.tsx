import React from 'react'
import { Tag } from '@/components/ui/tag'
import { CalendarBlank } from '@phosphor-icons/react/dist/ssr'

interface CardProps {
  status: Array<'cancelled' | 'checkin' | 'checkinLate' | 'checkout' | 'checkoutLate'>
  roomName: string
  placeName: string
  date: string
  time: string
}

const PastActivityCard: React.FC<CardProps> = ({ status, roomName, placeName, date, time }) => {
  // Render tags based on all statuses in the array
  const renderTags = () => {
    return status.map((currentStatus, index) => {
      switch (currentStatus) {
        case 'cancelled':
          return (
            <Tag key={index} variant="fail">
              Got Cancelled
            </Tag>
          )
        case 'checkin':
          return <Tag key={index}>Checked in successfully</Tag>
        case 'checkinLate':
          return (
            <Tag key={index} variant="fail">
              Checked in late, Got Penalty!
            </Tag>
          )
        case 'checkout':
          return <Tag key={index}>Checked out successfully</Tag>
        case 'checkoutLate':
          return (
            <Tag key={index} variant="fail">
              Checked out late, Got Penalty!
            </Tag>
          )
        default:
          return null
      }
    })
  }

  return (
    <div className="flex flex-col bg-yellow border-2 border-black p-4 rounded-3xl space-y-2 gap-1">
      <div className="flex flex-col items-start gap-1">
        <h2 className="text-h3">{roomName}</h2>
        <p className="text-h5">{placeName}</p>
      </div>
      <div className="flex flex-row gap-1 items-center">
        <CalendarBlank weight="bold" size={20} />
        <p className="text-h5">
          {date} at {time}
        </p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">{renderTags()}</div>
    </div>
  )
}

export { PastActivityCard }
