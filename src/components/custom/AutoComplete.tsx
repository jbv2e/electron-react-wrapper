import React, { useRef, useState } from 'react'

import { Check, ChevronDown, X } from 'lucide-react'

export interface AutoCompleteProps {
  data: { value: string; label: string }[]
  placeholder?: string
  emptyMessage?: string
  allowCustomValue?: boolean
  onValueChange?: (inputValue: string, selectedValue?: string) => void
}

export function AutoComplete({
  data = [],
  placeholder = '입력하거나 선택하세요...',
  emptyMessage = '결과가 없습니다.',
  allowCustomValue = true,
  onValueChange,
}: AutoCompleteProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectedValue, setSelectedValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // 입력값에 따라 옵션 필터링
  const filteredData = data.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()))

  // 정확히 일치하는 항목이 있는지 확인
  const exactMatch = data.find((item) => item.label.toLowerCase() === inputValue.toLowerCase())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setSelectedValue('')
    setOpen(value.length > 0)
    onValueChange?.(value)
  }

  const handleSelect = (item: { value: string; label: string }) => {
    setInputValue(item.label)
    setSelectedValue(item.value)
    setOpen(false)
    onValueChange?.(item.label, item.value)
  }

  const handleInputFocus = () => {
    if (inputValue.length > 0 || data.length > 0) {
      setOpen(true)
    }
  }

  const handleClear = () => {
    setInputValue('')
    setSelectedValue('')
    setOpen(false)
    onValueChange?.('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className='relative w-full'>
      {/* Input Field */}
      <div className='relative'>
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className='flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-20 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        />

        {/* Right side buttons */}
        <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1'>
          {inputValue && (
            <button
              onClick={handleClear}
              className='flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100'
            >
              <X className='h-3 w-3 text-gray-500' />
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            className='flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100'
          >
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Selection indicator */}
        {exactMatch && (
          <div className='absolute left-3 top-1/2 -translate-y-1/2'>
            <Check className='h-3 w-3 text-green-600' />
          </div>
        )}
      </div>

      {/* Dropdown Content */}
      {open && (
        <div className='absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg'>
          <div className='max-h-60 overflow-auto py-1'>
            {filteredData.length === 0 ? (
              <div className='px-3 py-2 text-sm text-gray-500'>
                {inputValue ? (
                  allowCustomValue ? (
                    <span>
                      <strong>"{inputValue}"</strong> - 사용자 정의 값으로 사용됩니다
                    </span>
                  ) : (
                    emptyMessage
                  )
                ) : (
                  '입력하여 검색하세요...'
                )}
              </div>
            ) : (
              <>
                {/* 필터링된 옵션들 */}
                {filteredData.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleSelect(item)}
                    className='flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none'
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedValue === item.value || inputValue === item.label
                          ? 'opacity-100 text-blue-600'
                          : 'opacity-0'
                      }`}
                    />
                    <span className='truncate'>{item.label}</span>
                  </button>
                ))}

                {/* 사용자 정의 값 옵션 (정확히 일치하지 않을 때) */}
                {allowCustomValue && inputValue && !exactMatch && (
                  <div className='border-t border-gray-100 mt-1 pt-1'>
                    <button
                      onClick={() => {
                        setOpen(false)
                        onValueChange?.(inputValue)
                      }}
                      className='flex w-full items-center px-3 py-2 text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none text-blue-600'
                    >
                      <span className='mr-2'>+</span>
                      <span className='truncate'>
                        "<strong>{inputValue}</strong>" 사용하기
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {open && <div className='fixed inset-0 z-40' onClick={() => setOpen(false)} />}
    </div>
  )
}
