import * as React from 'react'
import { User, Clock, ArrowRight } from '@phosphor-icons/react/dist/ssr'

interface CardProps {
  name: string // Name of the place
  numberOfPeople: string // Number of people
  time: string // Time string
  status: string // Status string
  bgColor: string // Background color string
}

const PlaceCard: React.FC<CardProps> = ({ name, numberOfPeople, time, status, bgColor }) => {
  return (
    <div
      className={`flex flex-col justify-end items-start py-4 px-5 border-2 border-black rounded-3xl h-40 bg-${bgColor} relative`}
    >
      <div className="flex items-center gap-2 absolute right-3 top-3">
        <div className="flex justify-center items-center py-2 px-4 rounded-3xl border-2 border-black bg-white">
          <p className="text-h5">{status}</p>
        </div>
        <div className="bg-white rounded-3xl border-black border-2 w-12 h-12 flex items-center justify-center px-2 py-2">
          <ArrowRight size={24} weight="bold" />
        </div>
      </div>
      <div className="flex flex-col items-start gap-1 self-stretch">
        <p className="text-h3">{name}</p>
        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2">
            <User size={20} weight="bold" />
            <p className="text-h5">{numberOfPeople}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={20} weight="bold" />
            <p className="text-h5">{time}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { PlaceCard }
