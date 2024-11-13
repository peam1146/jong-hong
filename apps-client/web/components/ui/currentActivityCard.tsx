'use client'

import React, { useEffect, useState } from 'react'

import { CalendarBlank, HourglassSimpleMedium } from '@phosphor-icons/react/dist/ssr'
import { DoorOpen, X } from '@phosphor-icons/react/dist/ssr'

interface CardProps {
  variant: 'jonging' | 'checking' | 'notdue'
  roomName: string
  placeName: string
  timeLeft?: number // in seconds for joining and checking variants
  date?: string // for notdue variant
  time?: string // for notdue variant
  onCheckOut?: () => void
  onCanceled?: () => void
}

const formatTimeLeft = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const CurrentActivityCard: React.FC<CardProps> = ({
  variant,
  roomName,
  placeName,
  timeLeft = 0,
  date,
  time,
  onCheckOut,
  onCanceled,
}) => {
  const [countdown, setCountdown] = useState(timeLeft)

  useEffect(() => {
    if (variant === 'jonging' || variant === 'checking') {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval) // Cleanup on unmount
    }
  }, [variant])

  return (
    <div className="flex flex-col bg-yellow border-2 border-black p-4 rounded-3xl space-y-2 gap-1 relative">
      <div className="flex flex-col items-start gap-1">
        <h2 className="text-h3">{roomName}</h2>
        <p className="text-h5">{placeName}</p>
      </div>
      {variant === 'jonging' && (
        <>
          <div className="flex flex-row justify-start items-center gap-2 py-2 px-4 rounded-3xl border-2 border-black bg-white h-10 w-fit">
            <HourglassSimpleMedium size={20} weight="bold" className="text-black" />
            <p className="text-h5">Jong Time Left : </p>
            <p className="text-h5 text-orange">{formatTimeLeft(countdown)}</p>
            <p className="text-h5">hr</p>
          </div>
          <button
            onClick={onCheckOut}
            className="flex justify-center items-center py-2 px-4 rounded-3xl border-2 border-black bg-black absolute right-4 top-2 flex-row gap-2"
          >
            <DoorOpen weight="bold" size={20} color="white" />
            <p className="text-h5 text-white">check out</p>
          </button>
        </>
      )}

      {variant === 'checking' && (
        <>
          <div className="flex flex-row justify-start items-center gap-2 py-2 px-4 rounded-3xl border-2 border-black bg-white h-10 w-fit">
            <HourglassSimpleMedium size={20} weight="bold" className="text-black" />
            <p className="text-h5">Check in within : </p>
            <p className="text-h5 text-orange">{formatTimeLeft(countdown)}</p>
            <p className="text-h5">hr</p>
          </div>
        </>
      )}

      {variant === 'notdue' && date && time && (
        <>
          <div className="flex flex-row gap-1 items-center">
            <CalendarBlank weight="bold" size={20} />
            <p className="text-h5 text-orange">{date}</p>
            <p className="text-h5">at</p>
            <p className="text-h5 text-orange">{time}</p>
          </div>
          <button
            onClick={onCanceled}
            className="flex justify-center items-center py-2 px-4 rounded-3xl border-2 border-black bg-white absolute right-4 top-2 flex-row gap-2"
          >
            <X weight="bold" size={20} color="black" />
            <p className="text-h5 text-black">cancel</p>
          </button>
        </>
      )}
    </div>
  )
}

export { CurrentActivityCard }
