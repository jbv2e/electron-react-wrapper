import { useState } from 'react'

import { AutoComplete } from '@/components/custom/AutoComplete'

const CodeSearch = () => {
  return (
    <div className='flex w-full h-full bg-white '>
      <AutoComplete data={[]} />
    </div>
  )
}

export default CodeSearch
