import { ipcMain } from 'electron'
import os from 'os'
import { getJsonData } from '../utils'

export const registerNetworkService = () => {

  function getLoacalIps() {
    const nets = os.networkInterfaces()
    const results: string[] = []

    Object.values(nets).forEach((netInfo) => {
      ;(netInfo || []).forEach((net) => {
        // IPv4, 내부 아님
        if (net.family === 'IPv4' && !net.internal) {
          results.push(net.address)
        }
      })
    })

    return results
  }
  // get local ip addresses
  ipcMain.handle('get-local-ips', () => {
    return getLoacalIps()
  })

  ipcMain.handle('get-domains', async () => {
    const domains = await getJsonData<Record<string, string>>('serverIP')
    // console.log(domains)
    const localIps = getLoacalIps()
    // let result : {[key: string] : any}  = {}
    // if (localIps.length > 0) {
    //   result = domains as {[key: string] : any}
    //   result['Local'] = localIps[0]
    // }
    let result : Record<string, string> = {...domains}
    if (localIps.length > 0) {
      result['Local'] = localIps[0]
    }
    // console.log(result)
    return result
  })
}
