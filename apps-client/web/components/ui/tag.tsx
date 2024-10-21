'use client'

import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
const variant = cva('text-h5 px-3 py-1 border-2 border-black w-fit rounded-full', {
  variants: {
    variant: {
      fail: 'bg-orange text-black',
      success: 'bg-green text-black',
    },
  },
  defaultVariants: {
    variant: 'success',
  },
})
export function Tag(props: VariantProps<typeof variant> & { children?: React.ReactNode }) {
  return <div className={cn(variant({ variant: props.variant }))}>{props.children}</div>
}
