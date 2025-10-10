import React, { useState } from 'react'
import { AutoComplete, AutoCompleteDataItem } from './AutoComplete'

// 샘플 데이터
const sampleData: AutoCompleteDataItem[] = [
  { code1: 'SEL01', code2: '서울시', code3: '강남구', code4: '역삼동' },
  { code1: 'SEL02', code2: '서울시', code3: '강동구', code4: '천호동' },
  { code1: 'SEL03', code2: '서울시', code3: '관악구', code4: '봉천동' },
  { code1: 'BUS01', code2: '부산시', code3: '해운대구', code4: '우동' },
  { code1: 'BUS02', code2: '부산시', code3: '사하구', code4: '감천동' },
  { code1: 'INC01', code2: '인천시', code3: '남동구', code4: '구월동' },
  { code1: 'DAE01', code2: '대전시', code3: '유성구', code4: '봉명동' },
  { code1: 'GWA01', code2: '광주시', code3: '동구', code4: '충장동' },
  { code1: 'DAG01', code2: '대구시', code3: '중구', code4: '동성로' },
]

export function AutoCompleteExample() {
  const [selectedItem, setSelectedItem] = useState<AutoCompleteDataItem | null>(null)

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-8">
      <div>
        <h1 className="mb-4 text-2xl font-bold">AutoComplete 컴포넌트 예제</h1>
        <p className="mb-6 text-gray-600">
          한글 초성 검색을 지원하는 자동완성 드롭다운입니다.
        </p>
      </div>

      <div className="space-y-6">
        {/* 기본 사용 예제 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">기본 사용</h2>
          <p className="text-sm text-gray-600">
            code1, code2 필드에서 검색하고, 모든 필드를 표시합니다.
          </p>
          <AutoComplete
            data={sampleData}
            displayFields={['code1', 'code2', 'code3', 'code4']}
            placeholder="지역을 선택하세요..."
            onSelect={(item) => {
              setSelectedItem(item)
              console.log('선택됨:', item)
            }}
          />
        </div>

        {/* 선택된 결과 표시 */}
        {selectedItem && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-semibold">선택된 항목:</h3>
            <pre className="text-xs">{JSON.stringify(selectedItem, null, 2)}</pre>
          </div>
        )}

        {/* 검색 예제 안내 */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold text-blue-900">검색 예제:</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• <strong>"ㅅㅅ"</strong> 입력 → 서울시 검색</li>
            <li>• <strong>"ㄱㄷ"</strong> 입력 → 강동구, 관악동 등 검색</li>
            <li>• <strong>"부산"</strong> 입력 → 부산시 검색</li>
            <li>• <strong>"SEL"</strong> 입력 → SEL01, SEL02 등 검색</li>
            <li>• <strong>"강남"</strong> 입력 → 강남구 검색</li>
          </ul>
        </div>

        {/* 다른 표시 필드 예제 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">표시 필드 커스터마이징</h2>
          <p className="text-sm text-gray-600">
            code1과 code2만 표시하는 예제입니다.
          </p>
          <AutoComplete
            data={sampleData}
            displayFields={['code1', 'code2']}
            placeholder="코드와 시/도만 표시..."
            onSelect={(item) => console.log('선택됨:', item)}
          />
        </div>
      </div>
    </div>
  )
}
