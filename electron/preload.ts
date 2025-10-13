import { contextBridge, ipcRenderer } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

contextBridge.exposeInMainWorld('electronAPI', {
  getLocalIPs: () => ipcRenderer.invoke('get-local-ips'),
  // getAllInterfaces: () => ipcRenderer.invoke('get-all-interfaces'),
  // Main Process로 SOAP 호출 요청을 보낼 함수를 노출
  callSoapService: (data: unknown) => ipcRenderer.invoke('call-soap-service', data),
  getJsonData: (filepath: string) => ipcRenderer.invoke('get-json-data', filepath),
  getDomains: () => ipcRenderer.invoke('get-domains'),
})
