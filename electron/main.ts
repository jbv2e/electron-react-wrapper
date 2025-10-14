import path from 'node:path'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { app, BrowserWindow } from 'electron'
// import { createClientAsync } from 'soap'
import { registerIpcHandlers } from './services'
// import { installContextMenu } from './contextMenu'


// import { getLocalIPs } from './utils'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

// get local ip addresses
// ipcMain.handle('get-local-ips', () => getLocalIPs())

// soap 웹서비스 조회
// ipcMain.handle('call-soap-service', async (_event, { wsdlUrl, methodName, args }) => {
//   try {
//     // win?.webContents.openDevTools()
//     console.log('call-soap-service invoked with:', { wsdlUrl, methodName, args })

//     const client = await createClientAsync(wsdlUrl)
//     // 'YourSoapMethod' 부분은 실제 호출하려는 웹서비스의 메서드명으로 변경해야 합니다.
//     const result = await client[`${methodName}Async`](args)
//     return result[0]
//   } catch (error) {
//     console.error('SOAP Error:', error)
//     // 오류 응답을 좀 더 구조화하여 전달할 수 있습니다.
//     return { error: error instanceof Error ? error.message : 'Unknown error' }
//   }
// })

function createWindow() {
  // console.log(process.env.VITE_PUBLIC)
  win = new BrowserWindow({
    // icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    icon: path.join(process.env.VITE_PUBLIC, 'icon-w.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
    minWidth: 300,
    minHeight: 400,
    width: 880,
    height: 650,
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // context 메뉴 추가
  // installContextMenu(win)

  win.setMenu(null) // Remove menu bar

  // win.webContents.openDevTools({
  //   mode: 'detach',
  // })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// app.whenReady().then(createWindow)
app.whenReady().then(() => {
  createWindow()
  // IPC 핸들러 등록
  registerIpcHandlers()
})
