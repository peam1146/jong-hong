import * as React from 'react'

import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'

const cardStyles = cva(
  'flex items-center justify-center min-h-24 rounded-lg p-4 self-stretch h-24 text-lg font-bold ml-[72px]', // Base styles
  {
    variants: {
      variant: {
        booked: 'bg-orange/50 text-white border-2 border-black/30',
        empty: 'bg-transparent border-2 border-green border-dashed text-green',
      },
    },
    defaultVariants: {
      variant: 'empty', // Set "empty" as the default variant
    },
  }
)

interface Props extends VariantProps<typeof cardStyles> {}

const TimeBox: React.FC<Props> = ({ variant }) => {
  return (
    <div className={cn(cardStyles({ variant }))}>{variant === 'booked' ? 'BOOKED' : 'EMPTY'}</div>
  )
}

export { TimeBox }
