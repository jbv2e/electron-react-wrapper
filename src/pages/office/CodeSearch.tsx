import { useCallback, useEffect, useState } from 'react'

// import { Combobox, ComboboxWithInput } from '@/components/custom/AutoCompleteSample'
// import ToastMessage from '@/components/custom/ToastMessage'
import { toast } from 'sonner'
import { AutoComplete, AutoCompleteDataItem } from '@/components/custom/AutoComplete'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
// import { title } from 'process'

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  data?: ComboboxOption[]
  placeholder?: string
  allowCustomValue?: boolean
  onValueChange?: (label: string, value: string) => void
  // ... 모든 props 타입 명시
}

export const frameworks: ComboboxOption[] = [
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt.js', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'ember', label: 'Ember.js' },
]

export const countries: ComboboxOption[] = [
  { value: 'kr', label: '대한민국' },
  { value: 'us', label: '미국' },
  { value: 'jp', label: '일본' },
  { value: 'cn', label: '중국' },
  { value: 'uk', label: '영국' },
  { value: 'de', label: '독일' },
  { value: 'fr', label: '프랑스' },
  { value: 'ca', label: '캐나다' },
  { value: 'au', label: '호주' },
  { value: 'br', label: '브라질' },
]

interface CodeSearchProps {
  classNameSelect?: string
}

const CodeSearch = ({ classNameSelect }: CodeSearchProps) => {
  const [codeCategory, setCodeCategory] = useState<string>('')
  const [codeCategoryOptions, setCodeCategoryOptions] = useState<{ value: string; label: string }[]>([])
  // const [codeIdOptions, setCodeIdOptions] = useState<{ value: string; label: string }[]>([])
  const [codeData, setCodeData] = useState<Partial<Record<string, AutoCompleteDataItem[]>>>({})

  const [codeDataOptions, setCodeDataOptions] = useState<AutoCompleteDataItem[]>([])

  const [selectedCodeList, setSelectedCodeList] = useState<string[] | null>([])

  // const setCodeOptionsData = (codeCategory: string) => {
  //   console.log('Setting options for category:', codeCategory)
  //   if (codeData && codeData[codeCategory]) {
  //     const ids = Object.keys(codeData[codeCategory] as object).map((key) => ({ value: key, label: key }))
  //     setCodeOptions(ids)
  //     console.log('Code IDs:', ids)
  //   } else {
  //     setCodeOptions([])
  //     console.log('No data for category')
  //   }
  // }

  const onCategoryChange = useCallback((value: string) => {
    // setCodeCategory(value)
    // JSON codeData 에서 해당 카테고리의 키와 일치하는 항목을 찾아서 codeIdOptions 설정

    setCodeCategory(value)
    // setCodeOptionsData(value)
    // debugger
  }, [])

  // usecallback when a code item is selected

  const onCodeSelect = useCallback((item: AutoCompleteDataItem) => {
    // console.log('Selected code item:', item)
    if (item) {
      setSelectedCodeList(Object.values(item) as string[])
    } else {
      setSelectedCodeList(null)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      const data = (await window.electronAPI.getJsonData('codeData')) as Partial<Record<string, AutoCompleteDataItem[]>>
      // console.log('JSON Data:', data)
      // console.log(Object.keys(data))
      // debugger
      setCodeData(data)

      const opts = Object.keys(data).map((key) => ({ value: key, label: key }))
      setCodeCategoryOptions(opts)
      // console.log(opts)
      if (opts.length > 0) {
        onCategoryChange(opts[0].value)
        // setCodeCategory(opts[0].value)
        // setCodeOptionsData(opts[0].value)
      } else {
        setCodeCategory('')
      }
    })()
  }, [onCategoryChange])

  // 데이터 평탄화
  // const flattenedData = Object.values(codeData).reduce((acc, curr) => {
  //   if (typeof curr === 'object' && curr !== null) {
  //     return { ...acc, ...curr }
  //   }
  //   return acc
  // }, {} as { [key: string]: any })

  useEffect(() => {
    if (codeData && codeData[codeCategory]) {
      setCodeDataOptions(codeData[codeCategory] ?? [])
      //   // debugger
      //   // console.log('codeData[value]:' + (codeData[value] as object) )
      //   console.log(Object.values(codeData[codeCategory]))
      //   const ids = Object.values(codeData[codeCategory]).map((item: any) => ({ value: item.id, label: item.id }))
      //   setCodeOptions(ids)
      // console.log('Code IDs:', ids)
      // debugger
      // const flat = flattenedData
      //   // const ids = Object.keys(codeData[value] as object).map((key) => ({ value: key, label: key }))
      //   // setCodeOptions(ids)
      //   // console.log('Code IDs:', ids)
      // } else {
      //   setCodeOptions([])
      //   console.log('No data for category')
    }
    // console.log('Selected Category:', codeCategory)
  }, [codeData, codeCategory])

  return (
    <div className='flex flex-1 w-full h-full bg-white flex-col  '>
      <div className={cn('flex flex-row gap-1 p-2 w-full ', classNameSelect)}>
        <div className='w-1/5 flex flex-col min-w-[125px]'>
          <Select value={codeCategory} onValueChange={(e) => onCategoryChange(e)}>
            <SelectTrigger className='w-full h-full text-xs flex-1'>
              <SelectValue />
            </SelectTrigger>

            <SelectContent className=' '>
              {codeCategoryOptions &&
                codeCategoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className='text-sm py-1'>
                    {option.label}
                  </SelectItem>
                ))}
              {/* <SelectItem value='light'>Light</SelectItem>
              <SelectItem value='dark'>Dark</SelectItem>
              <SelectItem value='system'>System</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
        <AutoComplete data={codeDataOptions} onSelect={onCodeSelect} className='text-sm' />

        {/* end auto*/}
      </div>
      {/* 선택에 따라 code list를 항목별로 버튼 표시 */}
      {/* <div className='flex h-full gap-x-4 border-l flex-wrap justify-center items-start '> */}
      <div className='flex flex-row h-full gap-x-4 justify-center items-center '>
        <div className='flex flex-wrap justify-center items-center gap-x-3 gap-y-4 h-auto'>
          {selectedCodeList && selectedCodeList.length > 0 ? (
            selectedCodeList.map((code, index) => (
              <button
                key={index}
                className='text-sm px-4 py-3  rounded-2xl bg-gray-100 hover:bg-gray-200 
              break-all shadow-2xl text-center  text-gray-700 transition 
              hover:animate-bounceY '
                onClick={() => {
                  // 클릭 시 코드 복사
                  navigator.clipboard.writeText(code)

                  // alert('코드가 복사되었습니다: ' + code)
                  // toast 메시지
                  toast.success(' 복사되었습니다!', { duration: 1000, position: 'bottom-center' })
                  // toast("", {
                  //   description: ' 복사되었습니다!',
                  //   duration: 1000,
                  //   position: "bottom-center",
                  //   richColors: true
                  // })
                }}
              >
                {code}
              </button>
            ))
          ) : (
            <div className='text-xs text-gray-500'></div>
          )}
        </div>

        {/* end button */}
      </div>
    </div>
  )
}

export default CodeSearch
