import './App.css'

// import { Profiler } from 'react'

// import { Profiler } from 'react'

// import { Copy } from 'lucide-react'
// import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CodeSearch from './pages/office/CodeSearch'
// import CustomButton from './components/CustomButton'
import SubPageTest from './pages/subs/SubPageTest'
import WrapperMain from './pages/wrapper/WrapperMain'
import { Toaster } from './components/ui/sonner'

const tabs = [
  {
    name: 'Wrapper',
    value: 'wrapper',
  },
  {
    name: 'Code',
    value: 'Code',
  },

]

function App() {
  // const [count, setCount] = useState(0)

  // const onRenderCallback = (id: string, phase: string, actualDuration: number) => {
  //   console.log({ id, phase, actualDuration })
  // }

  return (
    <div className='bg-background text-foreground p-1 h-screen flex flex-col'>
      <Tabs defaultValue={tabs[0].value} className='flex w-full h-full bg-white  ' >
        <TabsList className='p-0 h-auto  gap-1  bg-white border-b border-gray-200 '>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold h-auto px-3 py-2 text-sm hover:bg-primary/10'
            >
              <code className='text-[13px]'>{tab.name}</code>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value='wrapper' className='flex h-auto border-t'>
          {/* <Profiler id='wrapper' onRender={onRenderCallback}> */}
          <WrapperMain></WrapperMain>
          {/* </Profiler> */}
        </TabsContent>
        <TabsContent value='Code' className='border-t' asChild>
          <div>
            <CodeSearch></CodeSearch>
            </div>
        </TabsContent>
        <TabsContent value='Test' className=' ' asChild>
          <div className='flex flex-col '>
            <SubPageTest className=' '></SubPageTest>
          </div>
        </TabsContent>
        <TabsContent value='bun'>
          <div className='flex h-auto bg-white '>bun</div>
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
      {/* 
      <div className='bg-background text-foreground min-h-screen p-6'>
        <h1 className='text-3xl font-bold tracking-tight'>Create a new project</h1>
        test;;22
        <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
        <CustomButton variant='black' size={'md'} label={'Try Again'}></CustomButton>
        <CustomButton test={'red'} size={'md'} label={'장바구니'} text-style={'aa'}></CustomButton>
        <Button variant={'blue'} size={'wlg'} label={'회원가입'}></Button> 
        <button className='text-white bg-amber-300'>Primary Button</button>
        <Button className='active:scale-95 transition-transform flex flex-wrap items-center gap-2 md:flex-row bg-blue-200'>
          Click me
        </Button>
      </div> */}

      <Toaster richColors position="top-right"  />
      {/* <Toaster
        toastOptions={{
          classNames: {
            toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-muted-foreground',
            actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          },
        }}
/> */}
    </div>
  )
}

export default App
