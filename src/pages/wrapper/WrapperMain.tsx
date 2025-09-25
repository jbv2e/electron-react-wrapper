import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import CustomTextArea from '@/components/CustomTextArea'
// import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
// import { AutoComplete } from '@/components/custom/AutoComplete'
// import AutoCompleteTest from '@/components/custom/AutoCompleteTest'
import LabelInput from '@/components/custom/LabelInput'
import LabelSelect from '@/components/custom/LabelSelect'
// import SelectPopup from '@/components/custom/SelectPopup'
// import { TextareaAutosize } from '@/components/custom/TextAreaAutosize'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

// import WrapperHeader from './WrapperHeader'

// import { Textarea } from '@/components/ui/textarea'

// import './Wrapper.css'

// import { Input } from '@/components/ui/input'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const targetEnvDefaultOptions = [
  { value: 'LOCAL', label: 'Local' },
  { value: 'AIT', label: 'AIT' },
  { value: 'SIT', label: 'SIT' },
  { value: 'PROD', label: 'PROD' },
]

const autoFunctionOptions = [
  { value: 'A', label: 'A' },
  { value: 'M', label: 'M' },
]

const serviceIdOptions = [
  { value: 'PSTN', label: 'PSTN' },
  { value: 'INTERNET', label: 'INTERNET' },
  { value: 'IPTV', label: 'IPTV' },
  { value: 'SOIP', label: 'SOIP' },
]

const functionCodeOptions = [
  { value: 'ORRE', label: 'ORRE' },
  { value: 'PRDI', label: 'PRDI' },
  { value: 'LORD', label: 'LORD' },
  { value: 'PHRD', label: 'PHRD' },
  { value: 'RECO', label: 'RECO' },
  { value: 'JUJO', label: 'JUJO' },
  { value: 'REAC', label: 'REAC' },
  { value: 'WODI', label: 'WODI' },
  { value: 'FUCO', label: 'FUCO' },
  { value: 'MAUP', label: 'MAUP' },
  { value: 'ORCN', label: 'ORCN' },
  { value: 'SACT', label: 'SACT' },
  { value: 'SWBO', label: 'SWBO' },
  { value: 'INIT', label: 'INIT' },
]

// const functionCodeButtons = [
//   { id: 'ORRE', label: 'ORRE' },
//   { id: 'PRDI', label: 'PRDI' },
//   { id: 'LORD', label: 'LORD' },
//   { id: 'PHRD', label: 'PHRD' },
//   { id: 'RECO', label: 'RECO' },
//   { id: 'JUJO', label: 'JUJO' },
//   { id: 'REAC', label: 'REAC' },
//   { id: 'WODI', label: 'WODI' },
//   { id: 'FUCO', label: 'FUCO' },
//   { id: 'MAUP', label: 'MAUP' },
//   { id: 'ORCN', label: 'ORCN' },
//   { id: 'SACT', label: 'SACT' },
//   { id: 'SWBO', label: 'SWBO' },
//   { id: 'INIT', label: 'INIT' },
// ]

declare global {
  interface Window {
    electronAPI: {
      getLocalIPs: () => Promise<string>
      // getAllInterfaces: () => Promise<any[]>
      callSoapService: (data: unknown) => Promise<{ NumberToWordsResult: string }>
    }
  }
}
const useRenderCount = (componentName: string) => {
  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current += 1

    if (process.env.NODE_ENV === 'development') {
      // ✅ 조건문을 useEffect 내부에 배치
      console.log(`${componentName} 렌더링 횟수:`, renderCount.current)
    }
  })

  return renderCount.current
}

const WrapperMain = () => {
  // const [targetEnv, setTargetEnv] = useState()
  const [targetEnvOptions, setTargetEnvOptions] = useState<{ value: string; label: string }[]>([])
  const [targetEnv, setTargetEnv] = useState('')
  const [targetDomain, setTargetDomain] = useState('')
  // const [localIps, setLocalIps] = useState<string[]>([])

  const [custOrdrNo, setCustOrdrNo] = useState('')
  const [autoFunctionCode, setAutoFunctionCode] = useState('A')
  const [detailFunctionCode, setDetailFunctionCode] = useState('')
  const [lineItemNum, setLineItemNum] = useState('')
  const [serviceId, setServiceId] = useState('PSTN')
  const [revisionNum, setRevisionNum] = useState('')
  const [officesCode, setOfficesCode] = useState('')
  const [ordrTypeId, setOrdrTypeId] = useState('')
  const [ordrTrtTypeSeq, setOrdrTrtTypeSeq] = useState('')
  const [ordrTrtNo, setOrdrTrtNo] = useState('')
  const [subType, setSubType] = useState('')
  const [prevStatus, setPrevStatus] = useState('')
  const [functionCode, setFunctionCode] = useState('ORRE')

  const [IFProcessDt, setIFProcessDt] = useState('')

  const [orderDetail, setOrderDetail] = useState('')

  const headerLayout = useRef<HTMLDivElement>(null)
  const mainLayout = useRef<HTMLDivElement>(null)
  const [footerHeight, setFooterHeight] = useState(0)

  useRenderCount('Wrapper')

  useLayoutEffect(() => {
    const updateFooterHeight = () => {
      if (headerLayout.current && mainLayout.current) {
        const windowHeight = window.innerHeight
        const headerHeight = headerLayout.current.getBoundingClientRect().height
        const mainHeight = mainLayout.current.getBoundingClientRect().height

        setFooterHeight(windowHeight - headerHeight - mainHeight - 50)
      }
    }

    // 초기 실행
    updateFooterHeight()

    // resizeObserver - 크기 변경 감지
    const resizeObserver = new ResizeObserver(updateFooterHeight)
    const windowResizeObserver = () => updateFooterHeight()

    window.addEventListener('resize', windowResizeObserver)
    if (headerLayout.current) resizeObserver.observe(headerLayout.current)
    if (mainLayout.current) resizeObserver.observe(mainLayout.current)

    return () => {
      window.removeEventListener('resize', windowResizeObserver)
      resizeObserver.disconnect()
    }
  }, [])

  // 이벤트 핸들러들

  // targetEnv 변경 이벤트
  const onChangeTargetEnv = useCallback((value: string) => {
    setTargetEnv(value)
    setTargetDomain(value)
  }, [])

  // wrapper 공정호출
  const onClickWrpperCall = useCallback(() => {
    // ws 테스트
    ;(async () => {
      try {
        const result: { NumberToWordsResult: string } = await window.electronAPI.callSoapService({
          // // wsdlUrl: 'http://www.dneonline.com/calculator.asmx?WSDL',
          // methodName: 'Add',
          // args: { intA: 5, intB: 3 },

          wsdlUrl: 'http://dataaccess.com/webservicesserver/numberconversion.wso?WSDL',
          methodName: 'NumberToWords',
          args: { ubiNum: 500 },
        })
        console.log('SOAP Result:', result?.NumberToWordsResult) // { AddResult: 8 }
      } catch (error) {
        console.error('SOAP Call Error:', error)
      }
    })()
  }, [])

  // 입력 초기화
  const onClickRuleInit = useCallback(() => {
    setCustOrdrNo('')
    setLineItemNum('')
    setRevisionNum('')
    setOfficesCode('')
    setOrdrTypeId('')
    setOrdrTrtTypeSeq('')
    setOrdrTrtNo('')
    setSubType('')
    setPrevStatus('')
    setDetailFunctionCode('')
    setIFProcessDt('')

    // setFunctionCode('ORRE')
    // setAutoFunctionCode('A')
    setServiceId('PSTN')
    // setOrderDetail('')
  }, [])

  // functionCode 버튼 클릭 이벤트
  // const onClickFunctionCode = useCallback((id: string) => {
  //   if (id === 'ORCN') {
  //     setIFProcessDt(formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')) // dayjs().format
  //   }
  // }, [])
  // functionCode 변경 이벤트
  const onChangeFunctionCode = useCallback((value: string) => {
    setFunctionCode(value)

    if (value === 'ORCN') {
      // 현재 시간 locale적용. yyyy-MM-dd HH24:mm:ss
      setIFProcessDt(formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')) // dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  }, [])

  // orderDetail 변경 이벤트
  const onChangeOrderDetail = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOrderDetail(e.target.value)
  }, [])

  const onSelectedOrderDetail = (orderDetail: string[]) => {
    if (orderDetail.length < 8) return

    setCustOrdrNo(orderDetail[5] || '')
    setLineItemNum(orderDetail[6] || '')

    if (serviceIdOptions.some((item) => item.value === orderDetail[0])) {
      setServiceId(orderDetail[0])
    }
    setRevisionNum(orderDetail[7] || '')
    setOfficesCode(orderDetail[3] || '')
    setOrdrTypeId(orderDetail[1] || '')
    setOrdrTrtTypeSeq(orderDetail[2] || '')
    setOrdrTrtNo(orderDetail[4] || '')
  }

  useEffect(() => {
    // console.log('footerHeight updated:', footerHeight)

    window.electronAPI?.getLocalIPs().then((ips) => {
      // console.log('Local IPs:', ips)
      // setTargetDomain(ips.length > 0 ? ips[0] : '')
      console.log('ips:', ips)

      const fetchDomain = () => {
        const localIp = ips.length > 0 ? ips[0] : ''
        const newOptions = targetEnvDefaultOptions.map((item) => {
          if (item.label === 'Local') {
            return { label: 'Local', value: localIp }
          }
          return item
        })
        setTargetEnvOptions(newOptions)
        setTargetEnv('SIT')

        onChangeTargetEnv('SIT')
      }

      fetchDomain()
    })
  }, [onChangeTargetEnv])

  return (
    <div className='flex flex-col  h-full w-full   '>
      <header ref={headerLayout} className='flex items-center border-b border-gray-200 px-2 py-3 gap-x-5'>
        {' '}
        <LabelSelect
          id='targetEnv'
          label='시험대상'
          options={targetEnvOptions}
          onValueChange={onChangeTargetEnv}
          defaultValue={targetEnv}
          containerClassName='w-[180px] '
        />
        <LabelInput label='Domain' value={targetDomain} onChange={setTargetDomain} containerClassName='text-xs' />
      </header>
      <main
        ref={mainLayout}
        className='grid grid-cols-1 gap-2 minus-sm:grid-rows-8 minus-sm:grid-cols-[minmax(0,_250px)_minmax(0,280px)] minus-sm:grid-flow-col   sm:grid-cols-[minmax(0,_250px)_minmax(0,_250px)_minmax(0,_280px)]      py-2  overflow-visible text-xs  gap-x-5 gap-y-1   px-2'
      >
        <LabelInput
          id='custOrdrNo'
          label='OrderNum'
          value={custOrdrNo}
          onChange={setCustOrdrNo}
          labelClassName='text-left w-[85px]'
          containerClassName='order-1  sm:order-1  '
        />
        <LabelInput
          id='lineItemNum'
          label='LineItemNum'
          value={lineItemNum}
          onChange={setLineItemNum}
          labelClassName='text-left w-[85px]'
          containerClassName='order-2  sm:order-2'
        />
        <LabelInput
          id='revisionNum'
          label='RevisionNum'
          value={revisionNum}
          onChange={setRevisionNum}
          labelClassName='text-left w-[85px]'
          containerClassName='order-3 sm:order-3 '
        />
        <LabelInput
          id='officesCode'
          label='OfficesCode'
          value={officesCode}
          onChange={setOfficesCode}
          labelClassName='text-left w-[85px]'
          containerClassName='order-4 sm:order-4 '
        />
        <LabelSelect
          label='FunctionCode'
          defaultValue={functionCode}
          onValueChange={onChangeFunctionCode}
          options={functionCodeOptions}
          labelClassName='text-left w-[85px]'
          containerClassName='order-5  sm:order-5 '
        />

        {/* <SelectPopup
          popupTitle='공정'
          showPopupTitle={false}
          Buttons={functionCodeButtons}
          isCloseButton={false}
          onButtonClick={onClickFunctionCode}
          triggerClassName='w-full order-5  sm:order-5'
        ></SelectPopup> */}
        <LabelInput
          label='OrdrTypeId'
          value={ordrTypeId}
          onChange={setOrdrTypeId}
          labelClassName='text-left w-[85px]'
          containerClassName='order-6 sm:order-6 '
        />
        <LabelInput
          label='OrdrTrtTypeSeq'
          value={ordrTrtTypeSeq}
          onChange={setOrdrTrtTypeSeq}
          labelClassName='text-left w-[85px]'
          containerClassName='order-7  sm:order-7 '
        />
        <LabelInput
          label='OrdrTrtNo'
          value={ordrTrtNo}
          onChange={setOrdrTrtNo}
          labelClassName='text-left w-[85px]'
          containerClassName='order-8 sm:order-8 '
        />
        <LabelSelect
          label='AutoFunction'
          defaultValue={autoFunctionCode}
          onValueChange={setAutoFunctionCode}
          options={autoFunctionOptions}
          labelClassName='text-left w-[85px]'
          containerClassName='order-9  sm:order-9 '
        />
        <LabelSelect
          id='serviceId'
          label='ServiceId'
          defaultValue={serviceId}
          onValueChange={setServiceId}
          options={serviceIdOptions}
          labelClassName='text-left w-[85px]'
          containerClassName='order-10  sm:order-10 '
        />
        <LabelInput
          id='subType'
          label='SubType'
          value={subType}
          onChange={setSubType}
          labelClassName='text-left w-[85px]'
          containerClassName='order-11 sm:order-11 '
        />
        <LabelInput
          id='prevStatus'
          label='PrevStatus'
          value={prevStatus}
          onChange={setPrevStatus}
          labelClassName='text-left w-[85px]'
          containerClassName='order-12  sm:order-12 '
        />
        <LabelInput
          label='detailFunctionCode'
          value={detailFunctionCode}
          onChange={setDetailFunctionCode}
          labelClassName='text-left w-[105px]'
          containerClassName='order-13  sm:order-17 '
        />
        <LabelInput
          id='IFProcessDt'
          label='IFProcessDt'
          value={IFProcessDt}
          onChange={setIFProcessDt}
          labelClassName='text-left w-[105px]'
          containerClassName='order-14 sm:order-18'
          inputClassName='text-xs'
        />
        <div className='hidden sm:block   order-15'></div>
        <div className='hidden sm:block   order-16'></div>
        <div className='hidden  order-14 '></div>
        <div className='hidden  order-14'></div>
        <div className='hidden  order-14'></div>
        <div className='hidden  order-14 '></div>
        <div className='hidden   order-14'></div>
        <div className='order-15  sm:order-13 '>
          <Button className='w-[130px]  text-xs' onClick={onClickWrpperCall}>
            Wrapper 공정호출
          </Button>
        </div>
        {/* <div className='hidden sm:block sm:order-3 md:order-3'>aa</div> */}
        <div className='order-16  sm:order-14'>
          <Button className='w-[130px] text-xs' onClick={onClickRuleInit}>
            입력 초기화
          </Button>
        </div>
      </main>
      <footer
        className={`min-h-16 items-center justify-center border-t border-gray-200 pb-3`}
        style={{ height: footerHeight }}
      >
        <CustomTextArea
          id='orderDetail'
          ariaLabel='orderDetail'
          className={`mainHeightw-full h-full rounded-md border border-gray-300 bg-gray-10 text-sm text-gray-700 overflow-y-auto resize-none `}
          text={orderDetail}
          onChangeText={onChangeOrderDetail}
          onSelectedText={onSelectedOrderDetail}
        ></CustomTextArea>
      </footer>
    </div>
  )
}

export default WrapperMain
