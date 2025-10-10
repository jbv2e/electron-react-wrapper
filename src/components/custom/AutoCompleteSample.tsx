import React, { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

// shadcn/ui 컴포넌트 import
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// ===== 타입 정의 =====

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  data?: ComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  allowCustomValue?: boolean
  value?: string
  onValueChange?: (label: string, value: string) => void
  className?: string
  disabled?: boolean
}

export interface ComboboxWithInputProps {
  data?: ComboboxOption[]
  placeholder?: string
  emptyMessage?: string
  allowCustomValue?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, selectedValue: string) => void
  className?: string
  disabled?: boolean
}

// ===== 기본 Combobox 컴포넌트 =====

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  ({
    data = [],
    placeholder = "입력하거나 선택하세요...",
    searchPlaceholder = "검색...",
    emptyMessage = "결과가 없습니다.",
    allowCustomValue = true,
    value,
    onValueChange,
    className,
    disabled = false
  }, ref) => {
  const [open, setOpen] = useState<boolean>(false)
  const [selectedValue, setSelectedValue] = useState<string>(value || "")

  // 현재 선택된 아이템 찾기
  const selectedItem = data.find((item) => item.value === selectedValue)

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === selectedValue ? "" : currentValue
    setSelectedValue(newValue)
    setOpen(false)
    
    const item = data.find(opt => opt.value === newValue)
    onValueChange?.(item?.label || "", newValue)
  }

  const handleCustomValue = (customValue: string) => {
    setSelectedValue("")
    setOpen(false)
    onValueChange?.(customValue, customValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          {selectedItem ? selectedItem.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder}
            className="h-9"
          />
          <CommandEmpty>
            <div className="py-4 text-center text-sm">
              {allowCustomValue ? (
                <div className="space-y-2">
                  <p>{emptyMessage}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector<HTMLInputElement>('[cmdk-input]')
                      const inputValue = input?.value
                      if (inputValue) {
                        handleCustomValue(inputValue)
                      }
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    + 새로운 항목으로 추가
                  </Button>
                </div>
              ) : (
                emptyMessage
              )}
            </div>
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => handleSelect(item.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
})

Combobox.displayName = "Combobox"

// ===== 입력과 선택 통합 Combobox =====

export const ComboboxWithInput = React.forwardRef<HTMLButtonElement, ComboboxWithInputProps>(
  ({
    data = [],
    placeholder = "입력하거나 선택하세요...",
    emptyMessage = "결과가 없습니다.",
    allowCustomValue = true,
    value,
    defaultValue = "",
    onValueChange,
    className,
    disabled = false
  }, ref) => {
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>(value || defaultValue)
  const [selectedValue, setSelectedValue] = useState<string>("")

  // 입력값으로 데이터 필터링
  const filteredData = data.filter((item) =>
    item.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  // 정확히 일치하는 항목 확인
  const exactMatch = data.find((item) => 
    item.label.toLowerCase() === inputValue.toLowerCase()
  )

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setSelectedValue("")
    onValueChange?.(value, "")
  }

  const handleSelect = (item: ComboboxOption) => {
    setInputValue(item.label)
    setSelectedValue(item.value)
    setOpen(false)
    onValueChange?.(item.label, item.value)
  }

  const handleCustomValue = () => {
    if (inputValue && !exactMatch) {
      setOpen(false)
      onValueChange?.(inputValue, inputValue)
    }
  }

  return (
    <div className="grid w-full gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn("w-full justify-between font-normal", className)}
          >
            <div className="flex items-center flex-1 text-left">
              {exactMatch && (
                <Check className="mr-2 h-4 w-4 text-green-600" />
              )}
              <span className="truncate">
                {inputValue || placeholder}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              value={inputValue}
              onValueChange={handleInputChange}
              placeholder="검색하거나 입력하세요..."
              className="h-9"
            />
            <CommandList>
              {filteredData.length === 0 ? (
                <CommandEmpty>
                  <div className="py-4 text-center text-sm space-y-2">
                    <p className="text-muted-foreground">
                      {inputValue ? emptyMessage : "입력하여 검색하세요..."}
                    </p>
                    {allowCustomValue && inputValue && !exactMatch && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCustomValue}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        + "{inputValue}" 사용하기
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredData.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => handleSelect(item)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          (selectedValue === item.value || inputValue === item.label)
                            ? "opacity-100 text-blue-600" 
                            : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                  
                  {/* 사용자 정의 값 옵션 */}
                  {allowCustomValue && inputValue && !exactMatch && (
                    <>
                      <div className="px-2 py-1.5">
                        <div className="h-px bg-border"></div>
                      </div>
                      <CommandItem
                        onSelect={handleCustomValue}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <span className="mr-2">+</span>
                        "{inputValue}" 사용하기
                      </CommandItem>
                    </>
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
})

ComboboxWithInput.displayName = "ComboboxWithInput"