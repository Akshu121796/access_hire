import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 focus-visible:border-primary active:scale-95 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 border-transparent',
        destructive:
          'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
        outline:
          'border-2 border-indigo-100 bg-white text-indigo-700 hover:bg-indigo-50 hover:border-indigo-200',
        secondary:
          'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-100',
        ghost:
          'hover:bg-gray-100 text-gray-600 hover:text-gray-900 shadow-none hover:shadow-none',
        link: 'text-indigo-600 underline-offset-4 hover:underline shadow-none hover:shadow-none',
        glow: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300',
      },
      size: {
        default: 'h-12 px-6 py-3 has-[>svg]:px-4',
        sm: 'h-10 rounded-full gap-1.5 px-4 has-[>svg]:px-3 text-sm',
        lg: 'h-14 rounded-full px-8 has-[>svg]:px-6 text-lg',
        icon: 'size-12 rounded-full',
        'icon-sm': 'size-10 rounded-full',
        'icon-lg': 'size-14 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
