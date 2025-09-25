import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const LabelSelectVariants = cva(
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

interface LabelSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'value' | 'onChange'>,
    VariantProps<typeof LabelSelectVariants> {
  label: string // Make label a required prop
  containerClassName?: string // Optional class for the container
  labelClassName?: string // Optional class for the label
  selectClassName?: string // Optional class for the select element
  optionsClassName?: string // Optional class for the options
  // Add other props as needed, e.g., options, value, onChange, etc.
  defaultValue?: string
  options: { value: string; label: string }[]
  onValueChange?: (value: string) => void
}

const LabelSelect = ({
  containerClassName,
  labelClassName,
  selectClassName,
  optionsClassName,
  variant,
  size,
  label,
  id,
  defaultValue,
  options,
  onValueChange,
}: LabelSelectProps) => {
  const generatedId = React.useId()
  const inputId = id || generatedId
  return (
    <div className={cn(LabelSelectVariants({ variant, size }), containerClassName)}>
      <label className={cn('font-medium leading-none text-xs whitespace-nowrap', labelClassName)} htmlFor={inputId}>
        {label}
      </label>
      <Select value={defaultValue} onValueChange={(e) => onValueChange?.(e)}>
        <SelectTrigger id={inputId} size='sm' className={cn('text-xs flex-1', selectClassName)}>
          <SelectValue />
        </SelectTrigger>

        <SelectContent className='max-h-60 '>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={cn('text-[11px] h-5 py-1', optionsClassName)}
            >
              {option.label}
            </SelectItem>
          ))}
          {/* <SelectItem value='light'>Light</SelectItem>
          <SelectItem value='dark'>Dark</SelectItem>
          <SelectItem value='system'>System</SelectItem> */}
        </SelectContent>
      </Select>
    </div>
  )
}

export default LabelSelect
