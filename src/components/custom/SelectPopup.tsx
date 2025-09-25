import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type ButtonData = { label: string; id: string }

interface CustomPopupProps {
  showPopupTitle?: boolean
  popupTitle?: string
  Buttons?: ButtonData[]
  children?: React.ReactNode
  isCloseButton?: boolean
  triggerClassName?: string
  popupClassName?: string
  titleClassName?: string
  contentClassName?: string
  buttonClassName?: string
  onButtonClick?: (id: string) => void
}

export default function CustomPopup({
  showPopupTitle = false,
  popupTitle,
  Buttons,
  children,
  isCloseButton = true,
  triggerClassName,
  titleClassName,
  popupClassName,
  contentClassName,
  buttonClassName,
  onButtonClick,
}: CustomPopupProps) {
  const closePopover = () => setOpen(false)

  const [open, setOpen] = useState(false)

  // 버튼 클릭 핸들러
  const handleButtonClick = (id: string) => {
    onButtonClick?.(id)
    closePopover()
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            // 기본 스타일: shadcn/ui Button 컴포넌트와 유사한 스타일
            'inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:pointer-events-none disabled:opacity-50',
            // Primary variant 스타일
            'bg-primary text-primary-foreground shadow hover:bg-primary/90',
            'h-9 px-4 py-2 ',
            triggerClassName,
          )}
          aria-expanded={open}
          aria-haspopup='true'
        >
          {popupTitle}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          // 기본 PopoverContent 스타일 유지하면서 커스터마이징
          'w-60 p-0 bg-popover text-popover-foreground border rounded-md shadow-md',
          popupClassName,
        )}
        align='start'
      >
        {/* 헤더 */}
        {showPopupTitle && (
          <div
            className={cn('px-4 py-3 border-b bg-muted/50', 'font-semibold text-xs text-foreground', titleClassName)}
          >
            {popupTitle}
          </div>
        )}

        {/* 버튼 그룹 */}
        {Buttons && Buttons.length > 0 && (
          <div className={cn('p-4 space-y-2', contentClassName)}>
            <div className='flex flex-wrap gap-2'>
              {Buttons.map((button) => (
                <button
                  key={button.id}
                  className={cn(
                    // Secondary button 스타일
                    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
                    'h-8 px-3 py-1',
                    buttonClassName,
                  )}
                  onClick={() => handleButtonClick(button.id)}
                  type='button'
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 커스텀 콘텐츠 */}
        {children && <div className='px-4 pb-4'>{children}</div>}

        {/* 푸터 - 닫기 버튼 */}
        {isCloseButton && (
          <div className='flex justify-end px-4 py-3 border-t bg-muted/30'>
            <button
              className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                'text-muted-foreground hover:text-foreground',
                'h-8 px-3 py-1',
              )}
              onClick={closePopover}
              type='button'
            >
              닫기
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
