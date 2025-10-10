import { cn } from "@/lib/utils"

interface SubPageTestProps {
  className?: string
}

const SubPageTest = ({className } : SubPageTestProps) => {
  return (
    <div className={cn('flex-1 flex flex-col bg-white items-center justify-center', className)}>SubPage</div>
  )
}

export default SubPageTest