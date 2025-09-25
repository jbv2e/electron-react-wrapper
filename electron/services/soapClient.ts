// //node-soap 을 이용한 soap client
// import soap from 'soap'

// interface SOAPClientOptions {
//   headers?: {
//     userAgent?: { 'User-Agent': string }
//   }
// }

// class SOAPClient {
//   // SOAP client implementation
//   client: any
//   wsdlUrl: string | null

//   constructor() {
//     // Initialization code
//     this.client = null
//     this.wsdlUrl = null
//   }

//   async createClient(wsdlUrl: string, options: SOAPClientOptions = {}): Promise<void> {
//     try {
//       this.wsdlUrl = wsdlUrl

//       const defaultOptions = {
//         // http 요청 옵션
//         timeout: 3000, // 3초
//         // WSDL 파싱 옵션
//         ignoredNamespaces: { namespaces: [], override: false },
//         // SSL 옵션
//         rejectUnauthorized: false, // self-signed 인증서 허용
//         ...options,
//       }

//       this.client = await soap.createClientAsync(wsdlUrl, defaultOptions)

//       // 기본 헤더 설정(필요시)
//       if (options.headers) {
//         if (options.headers.userAgent) {
//           this.client.addHttpHeader('User-Agent', options.headers.userAgent['User-Agent'] || 'NodeSOAPClient/1.0')
//         }
//       }
//     } catch (err) {
//       console.error('Error creating SOAP client:', err)
//     }
//   }
// }

// export default SOAPClient
