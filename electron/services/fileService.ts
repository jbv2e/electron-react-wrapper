import { ipcMain } from 'electron'
// import fs from 'fs/promises'
// import { join } from 'path'
import { getJsonData } from '../utils'

// json code 파일 조회
export const registerFileService = () => {
  ipcMain.handle('get-json-data', async (_event, configName: string) => {
    // try {
    //   // console.log('root dir2:', process.cwd())
    //   // console.log('file path:', join(process.cwd(),'electron', 'data',`${configName}.json`))
      
    //   const data = await fs.readFile(join(process.cwd(),'electron', 'data',`${configName}.json`), 'utf-8')
    //   return JSON.parse(data)
    // } catch (error) {
    //   console.error('File Read Error:', error)
    //   return { error: error instanceof Error ? error.message : 'Unknown error' }
    // }
    return getJsonData(configName)
  })
}
