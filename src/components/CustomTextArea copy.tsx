import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { Textarea } from './ui/textarea'

interface CustomTextAreaProps {
  id: string
  ariaLabel: string
  className: string
  text: string
  onSelectedText: (selectedValue: string[]) => void
  onChangeText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const CustomTextArea = ({ id, ariaLabel, className, text, onSelectedText, onChangeText }: CustomTextAreaProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const setOrderDetailWithSelection = useCallback(
    (inText: string) => {
      if (!inText || inText.trim() === '') return

      //문자열을 공백으로 자른다
      const parts = inText.split(/\s+/)
      if (parts.length < 8) return

      const selectedText = parts.map((item, index) => {
        parts[index] = item || ''
        return parts[index].trim()
      })

      onSelectedText(selectedText)
      // setCustOrdrNo(parts[5] || '')
      // setLineItemNum(parts[6] || '')
      // setServiceId(parts[0] || '')
      // setRevisionNum(parts[7] || '')
      // setOfficesCode(parts[3] || '')
      // setOrdrTypeId(parts[1] || '')
      // setOrdrTrtTypeSeq(parts[2] || '')
      // setOrdrTrtNo(parts[4] || '')
    },
    [onSelectedText],
  )

  // 선택된 텍스트 업데이트 함수
  const updateSelection = useCallback(() => {
    const textArea = textareaRef.current
    if (!textArea) return

    const { selectionStart, selectionEnd } = textArea
    if (selectionStart === selectionEnd) return

    const selectedText = textArea.value.substring(selectionStart, selectionEnd)
    // setSelectionText(selectedText)
    setOrderDetailWithSelection(selectedText)
    // setSelectionInfo({ start: selectionStart, end: selectionEnd })
  }, [setOrderDetailWithSelection])

  useEffect(() => {
    const handleSelectionChange = () => {
      if (document.activeElement === textareaRef.current) {
        updateSelection()
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)

        // 약간의 지연 후 선택 상태 확인 (브라우저의 선택 완료를 기다림)
        setTimeout(() => {
          if (document.activeElement === textareaRef.current) {
            updateSelection()
            // console.log('MouseUp - Selection Updated')
          }
        }, 10)
      }
    }
    document.addEventListener('selectionchange', handleSelectionChange)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [updateSelection, isDragging])

  return (
    <>
      <Textarea
        id={id}
        aria-label={ariaLabel}
        ref={textareaRef}
        className={cn(className)}
        // rows={4}
        value={text}
        onChange={onChangeText}
        onSelect={() => updateSelection()}
        // onMouseUp={onTextAreaMouseUp}
        onMouseDown={() => setIsDragging(true)}
        onFocus={() => updateSelection()}
      ></Textarea>
    </>
  )
}

export default CustomTextArea
