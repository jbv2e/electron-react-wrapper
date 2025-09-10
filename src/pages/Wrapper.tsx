import { useState } from 'react'

import LabelInput from '@/components/custom/LabelInput'
import { Input } from '@/components/ui/input'

const Wrapper = () => {
  const [username, setUsername] = useState('Default User')

  return (
    <div className='bg-gray-50 font-splineSans text-gray-900 relative flex size-full flex-col grow'>
      <header className='flex items-center justify-between whitespace-nowrap border-b border-gray-200 px-10 py-3'>
        {' '}
        Header test
      </header>
      <main className='flex h-full flex-col items-center justify-center p-10 text-center'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='flex items-center gap-x-2'>
            <label className='text-sm font-medium leading-none' htmlFor='framework'>
              Framework
            </label>
            <Input id='framework' defaultValue='React' className='w-full focus-visible:ring-offset-0' />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium leading-none' htmlFor='framework'>
              Framework
            </label>
            <Input id='framework' placeholder='ring test' className='w-full' />
          </div>
          <LabelInput label='Framework' defaultValue='test' />
          <LabelInput
            label='Username (Controlled)'
            placeholder='Enter your username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <p className='mt-4'>Current Username: {username}</p>

        <h1 className='mb-6 mt-6 text-4xl font-bold'>test </h1>
        <p className='mb-6 text-lg text-gray-600'>This is a simple Electron application.</p>
        <button
          className='rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90'
          onClick={() => {
            window.ipcRenderer.send('asynchronous-message', 'ping')
          }}
        >
          Ping
        </button>
      </main>
      Loads Wrapper Page adfasdf asd fasdf asd fasdf as df
    </div>
  )
}

export default Wrapper
