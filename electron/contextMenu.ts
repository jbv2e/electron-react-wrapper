// main/contextMenu.ts
import { Menu, shell, BrowserWindow, clipboard } from 'electron'

export function installContextMenu(win: BrowserWindow) {
  const wc = win.webContents

  wc.on('context-menu', (_event, params) => {
    const {
      x, y,
      selectionText,
      isEditable,
      editFlags,          // canUndo, canRedo, canCut, canCopy, canPaste 등
      linkURL,
      srcURL,             // 이미지/비디오 src
      mediaType,          // 'none' | 'image' | 'video' | ...
      misspelledWord,     // 스펠링 체크 켠 경우
      dictionarySuggestions = [],
    } = params

    const template: Electron.MenuItemConstructorOptions[] = []

    // 1) 텍스트 선택 중
    if (selectionText && selectionText.trim().length > 0) {
      template.push(
        { label: '복사', role: 'copy', enabled: editFlags.canCopy },
        { label: '선택 영역 검색', click: () => shell.openExternal(`https://www.google.com/search?q=${encodeURIComponent(selectionText)}`) },
        { type: 'separator' },
      )
    }

    // 2) 입력 필드 내 (TextInput/Textarea 등)
    if (isEditable) {
      template.push(
        { label: '실행 취소', role: 'undo', enabled: editFlags.canUndo },
        { label: '다시 실행', role: 'redo', enabled: editFlags.canRedo },
        { type: 'separator' },
        { label: '잘라내기', role: 'cut', enabled: editFlags.canCut },
        { label: '복사', role: 'copy', enabled: editFlags.canCopy },
        { label: '붙여넣기', role: 'paste', enabled: editFlags.canPaste },
        { label: '삭제', role: 'delete', enabled: editFlags.canDelete },
        { type: 'separator' },
        { label: '전체 선택', role: 'selectAll' },
        { type: 'separator' },
      )
    }

    // 3) 링크 위
    if (linkURL) {
      template.push(
        { label: '링크 열기', click: () => shell.openExternal(linkURL) },
        { label: '링크 주소 복사', click: () => clipboard.writeText(linkURL) },
        { type: 'separator' },
      )
    }

    // 4) 이미지/미디어 위
    if (mediaType === 'image' && srcURL) {
      template.push(
        { label: '이미지 새 탭으로 열기', click: () => shell.openExternal(srcURL) },
        { label: '이미지 주소 복사', click: () => clipboard.writeText(srcURL) },
        { type: 'separator' },
      )
    }

    // 5) 철자 제안 (선택사항: 스펠링 체크 켠 경우)
    if (misspelledWord && dictionarySuggestions.length) {
      template.push(
        ...dictionarySuggestions.slice(0, 5).map(s => ({
          label: s,
          click: () => wc.replaceMisspelling(s),
        })),
        { type: 'separator' },
      )
    }

    // 6) 앱 커스텀 항목 (페이지별/선택영역별 필요한 기능 넣기)
    template.push(
      {
        label: '여기 좌표로 내 기능 실행',
        click: () => {
          // 예: 좌표(x,y)를 렌더러로 보내 무언가 수행
          wc.send('ctx:custom-action', { x, y })
        },
      },
    )

    // 7) 개발 도구 (개발 환경에서만)
    if (!appIsProd()) {
      template.push(
        { type: 'separator' },
        { label: '개발자 도구 열기', role: 'toggleDevTools' },
        { label: '새로고침', role: 'reload' },
      )
    }

    const menu = Menu.buildFromTemplate(template)
    menu.popup({ window: win })
  })
}

function appIsProd() {
  return process.env.NODE_ENV === 'production' || process.env.ELECTRON_ENV === 'production'
}
