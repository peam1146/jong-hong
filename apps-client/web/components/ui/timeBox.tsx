import * as React from 'react'

import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'

const cardStyles = cva(
  'flex items-center justify-center rounded-lg p-4 self-stretch text-lg font-bold ml-[72px]', // Base styles
  {
    variants: {
      variant: {
        booked: 'bg-orange/50 text-white border-2 border-black/30',
        available: 'bg-transparent border-2 border-green border-dashed text-green',
      },
    },
    defaultVariants: {
      variant: 'available', // Set "empty" as the default variant
    },
  }
)

interface Props extends VariantProps<typeof cardStyles> {
  style: React.CSSProperties
}

const TimeBox: React.FC<Props> = ({ variant, style }) => {
  return (
    <div className={cn(cardStyles({ variant }))} style={style}>
      {variant === 'booked' ? 'BOOKED' : 'EMPTY'}
    </div>
  )
}

export { TimeBox }
