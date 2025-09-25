import { useCallback, useRef } from 'react'

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 선택된 메시지 전달
  const processSelectedText = useCallback(
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
    },
    [onSelectedText],
  )

  // 선택된 텍스트 업데이트 함수
  const handleSelectionChange = useCallback(() => {
    const textArea = textareaRef.current
    if (!textArea) return

    const { selectionStart, selectionEnd, value } = textArea
    if (selectionStart === selectionEnd) return

    const selectedText = value.substring(selectionStart, selectionEnd)
    processSelectedText(selectedText)
  }, [processSelectedText])

  // 마우스를 눌렀을 때 포인터 캡처 설정
  const handlePointerDown = (event: React.PointerEvent<HTMLTextAreaElement>) => {
    // event.currentTarget은 이벤트 리스너가 부착된 엘리먼트
    event.currentTarget.setPointerCapture(event.pointerId)
  }

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
        // onPointerUp은 캡처 덕분에 textarea 밖에서 발생해도 감지됨
        onPointerDown={handlePointerDown}
        onPointerUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
      ></Textarea>
    </>
  )
}

export default CustomTextArea
