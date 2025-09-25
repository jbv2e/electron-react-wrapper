import { ipcMain } from 'electron'
import { createClientAsync } from 'soap'

export const registerSoapService = () => {
  // SOAP 서비스 관련 IPC 핸들러 등록
  ipcMain.handle('call-soap-service', async (_event, { wsdlUrl, methodName, args }) => {
    try {
      // win?.webContents.openDevTools()
      console.log('call-soap-service invoked with:', { wsdlUrl, methodName, args })

      const client = await createClientAsync(wsdlUrl)
      // 'YourSoapMethod' 부분은 실제 호출하려는 웹서비스의 메서드명으로 변경해야 합니다.
      const result = await client[`${methodName}Async`](args)
      return result[0]
    } catch (error) {
      console.error('SOAP Error:', error)
      // 오류 응답을 좀 더 구조화하여 전달할 수 있습니다.
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })
}
