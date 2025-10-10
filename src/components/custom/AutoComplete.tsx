import { useState, useMemo, useCallback } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'


// ===== 상수 정의 =====
const UNICODE_OFFSET_GA = 44032 // '가'의 유니코드 값
// const JUNGSEONG_COUNT = 21
const JONGSEONG_COUNT = 28
// const HANGUL_START = 0xAC00 // '가'
// const HANGUL_END = 0xD7A3   // '힣'
// const JASO_START = 0x3131   // 'ㄱ'
// const JASO_END = 0x3163     // 'ㅎ'

// 자음-음절 매핑 테이블
const CONSONANT_TO_SYLLABLE: Record<string, number> = {
  'ㄱ': '가'.charCodeAt(0),
  'ㄲ': '까'.charCodeAt(0),
  'ㄴ': '나'.charCodeAt(0),
  'ㄷ': '다'.charCodeAt(0),
  'ㄸ': '따'.charCodeAt(0),
  'ㄹ': '라'.charCodeAt(0),
  'ㅁ': '마'.charCodeAt(0),
  'ㅂ': '바'.charCodeAt(0),
  'ㅃ': '빠'.charCodeAt(0),
  'ㅅ': '사'.charCodeAt(0),
}

// 정규식 특수문자 이스케이프 패턴
const REGEX_SPECIAL_CHARS = /[-/\\^$*+?.()|[\]{}]/g



// 정규식 패턴 캐시를 위한 Map
const patternCache = new Map<string, string>()

// 한글 초성 검색을 위한 패턴 생성 함수 (메모이제이션 적용)
const ch2Pattern = (ch: string): string => {
  // 캐시 확인
  if (patternCache.has(ch)) {
    return patternCache.get(ch)!
  }

  let pattern: string

  // 한글 음절은 유니코드에서 **가(0xAC00) ~ 힣(0xD7A3)**까지 총 11,172자가 연속적으로 배치
  // 하나의 한글 글자 = 초성(19) × 중성(21) × 종성(28)
  // - 유니코드 계산 공식 : code = ((초성 * 21) + 중성) * 28 + 종성 + 0xAC00
  
  // 한국어 음절인지 확인
  if (/[가-힣]/.test(ch)) {
    // UNICODE_OFFSET_GA : '가'의 유니코드 값(44032)
    // JONGSEONG_COUNT : 종성 개수(28)
    // 종성이 없는 경우(초성+중성)와 종성이 있는 경우(초성+중성+종성)를 구분하여 처리
    // 예: '가'는 종성이 없으므로 '가' ~ '갛'까지, '각'은 종성이 있으므로 그대로 '각'만 검색
    // 종성이 없는 경우, 해당 초성+중성에 해당하는 모든 음절을 포함하는 범위를 정규식으로 생성
    // 예: '가' -> [가-갛], '나' -> [나-낗]
    // 종성이 있는 경우, 해당 글자만 검색
    // 예: '각' -> 각, '낙' -> 낙
    // 이를 위해 유니코드 값을 계산하여 범위를 설정
    // ch.charCodeAt(0) : 해당 글자의 유니코드 값
    // UNICODE_OFFSET_GA : '가'의 유니코드 값
    // JONGSEONG_COUNT : 종성 개수
    // code : 해당 글자의 유니코드 값에서 '가'의 유니코드 값을 뺀 값
    // code % JONGSEONG_COUNT : 종성의 유무를 판단하는 기준 (0이면 종성이 없는 글자)
    // Math.floor(code / JONGSEONG_COUNT) * JONGSEONG_COUNT + UNICODE_OFFSET_GA : 종성이 없는 글자의 시작 유니코드 값
    // begin : 종성이 없는 글자의 시작 유니코드 값
    // end : 종성이 없는 글자의 끝 유니코드 값 (begin + 27)
    // pattern : 최종적으로 생성된 정규식 패턴
    // 예: '가' -> [가-갛], '각' -> 각
    // 이 패턴을 통해 사용자가 초성만 입력해도 해당 초성으로 시작하는 모든 음절을 검색할 수 있게 됨
    // 예: '가' -> [가-갛], '각' -> 각

    const code = ch.charCodeAt(0) - UNICODE_OFFSET_GA
    // 종성이 있으면 그대로 검색
    if (code % JONGSEONG_COUNT > 0) {
      pattern = ch
    } else {
      // 종성이 없는 경우, 해당 초성과 중성 조합으로 시작하는 **모든 종성 조합(28개)**을 포함하는 범위를 계산
      // 예: '가' -> [가-갛], '나' -> [나-낗]
      const begin = Math.floor(code / JONGSEONG_COUNT) * JONGSEONG_COUNT + UNICODE_OFFSET_GA
      const end = begin + 27
      pattern = `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`
    }
  }
  // 한국어 자음
  else if (/[ㄱ-ㅎ]/.test(ch)) {
    // 자음에 해당하는 음절 범위를 계산하여 정규식 패턴 생성
    // 예: 'ㄱ' -> [ㄱ-깋], 'ㄴ' -> [ㄴ-닣]
    // CONSONANT_TO_SYLLABLE : 자음에 해당하는 가장 첫 음절의 유니코드 값 매핑 테이블
    // begin : 해당 자음으로 시작하는 음절의 시작 유니코드 값
    // end : 해당 자음으로 시작하는 음절의 끝 유니코드 값 (begin + 587)
    // pattern : 최종적으로 생성된 정규식 패턴
    // 이 패턴을 통해 사용자가 자음만 입력해도 해당 자음으로 시작하는 모든 음절을 검색할 수 있게 됨
    // 예: 'ㄱ' -> [가-깋], 'ㄴ' -> [나-닣]

    // 자음에 해당하는 음절이 없는 경우(예: 'ㅎ')를 대비하여 기본값 설정
    // (12613은 'ㅅ'에 해당하는 음절의 유니코드 값)

    //  한글 음절은 초성(19) × 중성(21) × 종성(28) = 11,172자
    // 초성 하나당 음절은 21 × 28 = 588
    // 따라서 자음의 위치 차이를 588과 곱하면 해당 자음으로 시작하는 음절의 유니코드 범위를 계산

    const begin = CONSONANT_TO_SYLLABLE[ch] || (ch.charCodeAt(0) - 12613) * 588 + CONSONANT_TO_SYLLABLE['ㅅ']
    const end = begin + 587
    pattern = `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`
  }
  // 영문자, 숫자, 특수문자 등은 그대로 검색 (정규식 특수문자 이스케이프)
  else {
    pattern = ch.replace(REGEX_SPECIAL_CHARS, '\\$&')
  }

  // 캐시에 저장
  patternCache.set(ch, pattern)
  // console.log('patternCache:', patternCache)
  return pattern
}

// 정규식 캐시를 위한 Map
const regexCache = new Map<string, RegExp>()

// 한글 초성 느슨한 검색 (lazy matching) - 메모이제이션 적용
const matchInitial = (text: string, query: string): boolean => {
  if (!query) return true

  // 한글 lazy 검색
  if (/[가-힣ㄱ-ㅎ]/.test(query)) {
    const pattern = query.split('').map(ch2Pattern).join('.*?')

    // 정규식 캐시 확인
    if (!regexCache.has(pattern)) {
      regexCache.set(pattern, new RegExp(pattern, 'i'))
    }

    const regex = regexCache.get(pattern)!
    return regex.test(text)
  }

  // 영문자, 숫자, 특수문자 등은 부분 일치 검색
  return text.toLowerCase().includes(query.toLowerCase())
}

export interface AutoCompleteDataItem {
  [key: string]: string | number | boolean
}

export interface AutoCompleteProps {
  data: AutoCompleteDataItem[]
  displayFields?: string[]
  placeholder?: string
  emptyMessage?: string
  onSelect?: (item: AutoCompleteDataItem) => void
  className?: string
}

export function AutoComplete({
  data = [],
  displayFields = ['CODE1', 'CODE2'],
  placeholder = '선택하세요...',
  emptyMessage = '결과가 없습니다.',
  onSelect,
  className,
}: AutoCompleteProps) {
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<AutoCompleteDataItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // 검색 결과 필터링 (메모이제이션 적용)
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data

    return data.filter((item) => {
      const code1 = String(item.CODE1 || '')
      const code2 = String(item.CODE2 || '')

      // code1과 code2 필드에서 검색 수행
      return matchInitial(code1, searchQuery) || matchInitial(code2, searchQuery)
    })
  }, [data, searchQuery])

  // 아이템 표시 텍스트 생성 (메모이제이션 적용)
  const getDisplayText = useCallback((item: AutoCompleteDataItem): string => {
    return displayFields
      .map((field) => String(item[field] || ''))
      .filter(Boolean)
      .join(' - ')
  }, [displayFields])

  // 선택된 아이템의 표시 텍스트
  const selectedDisplayText = useMemo(() =>
    selectedItem ? getDisplayText(selectedItem) : placeholder,
    [selectedItem, getDisplayText, placeholder]
  )

  // 아이템 선택 처리 (메모이제이션 적용)
  const handleSelect = useCallback((item: AutoCompleteDataItem) => {
    setSelectedItem(item)
    setOpen(false)
    onSelect?.(item)
  }, [onSelect])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
            'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            !selectedItem && 'text-gray-500',
            className
          )}
        >
          <span className="truncate">{selectedDisplayText}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="검색..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredData.map((item, index) => {
                const displayText = getDisplayText(item)
                const isSelected = selectedItem && 
                  displayFields.every(field => selectedItem[field] === item[field])

                return (
                  <CommandItem
                    key={index}
                    value={displayText}
                    onSelect={() => handleSelect(item)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="truncate">{displayText}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
