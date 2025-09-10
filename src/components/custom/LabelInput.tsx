import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Input } from '../ui/input'

export const LabelInputVariants = cva(
  'flex items-center gap-x-2', // Base styles for the container
  {
    variants: {
      variant: {
        default: 'flex-row items-center gap-x-2',
        stacked: 'flex-col items-start gap-y-1.5',
      },
      size: {
        default: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

// Extend InputHTMLAttributes to accept all standard input props, but omit 'size' to avoid conflict
export interface LabelInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof LabelInputVariants> {
  label: string // Make label a required prop
  containerClassName?: string // Optional class for the container
}

const LabelInput = React.forwardRef<HTMLInputElement, LabelInputProps>(
  ({ className, containerClassName, variant, size, label, id, ...props }, ref) => {
    const generatedId = React.useId()
    // Ensure id is present for accessibility, use the generated one if not provided
    const inputId = id || generatedId

    return (
      <div className={cn(LabelInputVariants({ variant, size }), containerClassName)}>
        <label className='text-sm font-medium leading-none' htmlFor={inputId}>
          {label}
        </label>
        <Input id={inputId} className={cn('w-full  focus-visible:ring-offset-0', className)} ref={ref} {...props} />
      </div>
    )
  },
)

LabelInput.displayName = 'LabelInput'

export default LabelInput
