import * as React from 'react'

import { ArrowRight, User } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

interface CardProps {
  name: string // Name of the place
  numberOfPeople: string // Number of people
  placeId: string // ID of the place
  id: string // ID of the place
}

const RoomCard: React.FC<CardProps> = ({ name, numberOfPeople, placeId, id }) => {
  return (
    <Link
      href={`${placeId}/${id}`}
      className="h-[140px] flex  flex-col bg-mustard py-4 px-4 justify-end flex-1 items-start border-2 border-black rounded-3xl relative"
    >
      <div className="bg-white rounded-3xl border-black border-2 w-10 h-10 flex items-center justify-center px-2 py-2 absolute right-4 top-4">
        <ArrowRight size={24} weight="bold" />
      </div>
      <p className="text-h3">{name}</p>
      <div className="flex items-center gap-2">
        <User size={20} weight="bold" />
        <p className="text-h5">{numberOfPeople}</p>
      </div>
    </Link>
  )
}

export { RoomCard }
