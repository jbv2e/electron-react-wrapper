import { registerNetworkService } from './networkService'
import { registerSoapService } from './soapService' // 예시

export function registerIpcHandlers() {
  registerNetworkService()
  registerSoapService()
}
