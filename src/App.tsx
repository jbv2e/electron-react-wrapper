import './App.css'

import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CustomButton from './components/CustomButton'
import Wrapper from './pages/Wrapper'

const tabs = [
  {
    name: 'pnpm',
    value: 'pnpm',
    content: 'pnpm dlx shadcn@latest add tabs',
  },
  {
    name: 'npm',
    value: 'npm',
    content: 'npx shadcn@latest add tabs',
  },
  {
    name: 'yarn',
    value: 'yarn',
    content: 'npx shadcn@latest add tabs',
  },
  {
    name: 'bun',
    value: 'bun',
    content: 'bunx --bun shadcn@latest add tabs',
  },
]

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className='bg-background text-foreground p-1'>
      <Tabs defaultValue={tabs[0].value} className='w-full bg-white'>
        <TabsList className='p-0 h-auto  gap-1'>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
            >
              <code className='text-[13px]'>{tab.name}</code>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value='pnpm'>
          <Wrapper></Wrapper>
        </TabsContent>

        {/* {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className='h-10 flex items-center justify-between border gap-2 rounded-md pl-3 pr-1.5'>
              <code className='text-[13px]'>{tab.content}</code>
              <Button size='icon' variant='secondary' className='h-7 w-7'>
                <Copy className='!h-3.5 !w-3.5' />
              </Button>
            </div>
          </TabsContent>
        ))} */}
      </Tabs>

      <div className='bg-background text-foreground min-h-screen p-6'>
        <h1 className='text-3xl font-bold tracking-tight'>Create a new project</h1>
        test;;22
        <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
        <CustomButton variant='black' size={'md'} label={'Try Again'}></CustomButton>
        <CustomButton test={'red'} size={'md'} label={'장바구니'} text-style={'aa'}></CustomButton>
        {/* <Button variant={'blue'} size={'wlg'} label={'회원가입'}></Button> */}
        <button className='text-white bg-amber-300'>Primary Button</button>
        <Button className='active:scale-95 transition-transform flex flex-wrap items-center gap-2 md:flex-row bg-blue-200'>
          Click me
        </Button>
      </div>
    </div>
  )
}

export default App
