import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

export default function ModalPopup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>모달 팝업 열기</button>
      </DialogTrigger>
      <DialogContent className='max-w-lg bg-white p-6 rounded shadow'>
        <div>모달 내 컨텐츠, 폼, 버튼 등 배치</div>
      </DialogContent>
    </Dialog>
  )
}
