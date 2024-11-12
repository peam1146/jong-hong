import * as React from 'react'
import { House, ClockCounterClockwise, Scan } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

const Navbar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-orange border-t-2 border-black flex justify-around items-center py-3 px-8 gap-10 max-w-[400px] mx-auto">
      <Link href="/">
        <House size={32} weight="bold" className="text-white" />
      </Link>
      <Link href="/qrscan">
        <Scan size={32} weight="bold" className="text-white" />
      </Link>
      <Link href="/activity">
        <ClockCounterClockwise size={32} weight="bold" className="text-white" />
      </Link>
    </div>
  )
}

export { Navbar }
