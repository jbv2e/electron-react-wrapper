import { ButtonHTMLAttributes, FC } from 'react'

import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const CustomButtonVariants = cva(
  `
  flex justify-center items-center active:scale-95 rounded-xl 
  text-sm font-bold text-slate-100 transition-all shadow-md
  hover:scale-105 duration-200
  `,
  {
    variants: {
      variant: {
        default: ' shadow-none active:scale-100',
        grey: ' bg-slate-buttongrey ',
        blue: ' bg-accent-blue',
        black: ' bg-slate-900 text-white shadow-lg',
      },
      size: {
        default: '',
        md: ' w-[6.875rem] h-[2.375rem] text-[1rem] rounded-md',
        lg: 'w-[21.875rem] h-[7.5rem] text-[3rem] rounded-3xl',
        wlg: 'w-[24rem] h-[5.25rem] text-[2rem]',
      },
      test: {
        default: 'bg-slate-500 text-white',
        red: 'bg-red-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      test: 'default',
    },
  },
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof CustomButtonVariants> {
  label?: string
  children?: React.ReactElement
}

const CustomButton: FC<ButtonProps> = ({ variant, size, test, children, label, ...props }) => {
  return (
    <button className={cn(CustomButtonVariants({ variant, size, test }))} {...props}>
      {children && children}
      {label && label}
    </button>
  )
}

export default CustomButton
