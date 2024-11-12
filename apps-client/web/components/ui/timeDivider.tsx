import * as React from 'react'

interface Props {
  time: string
}

const TimeDivider: React.FC<Props> = ({ time }) => {
  return (
    <div className="flex items-center self-stretch gap-2">
      <p className="text-h5 text-black/50">{time}</p>
      <hr className="w-full bg-black/20 h-[2px]"></hr>
    </div>
  )
}

export { TimeDivider }
