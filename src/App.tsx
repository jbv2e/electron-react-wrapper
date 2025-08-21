import './App.css'

import { Button } from '@/components/ui/button'
import CustomButton from './components/CustomButton'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className='bg-background text-foreground min-h-screen p-6'>
      test;;
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
      <CustomButton variant='black' size={'md'} label={'Try Again'}></CustomButton>
      <CustomButton test={'red'} size={'md'} label={'장바구니'} text-style={'aa'}></CustomButton>
      {/* <Button variant={'blue'} size={'wlg'} label={'회원가입'}></Button> */}
      <button className='text-white bg-amber-300'>Primary Button</button>
      <Button className='active:scale-95 transition-transform flex flex-wrap items-center gap-2 md:flex-row bg-blue-200'>
        Click me
      </Button>
    </div>
  )
}

export default App
