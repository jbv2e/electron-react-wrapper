
import fs from 'fs/promises'
import { join } from 'path'

// import os from 'os'

// export function getLocalIPs(): string[] {
//   const nets = os.networkInterfaces()
//   const results: string[] = []

//   Object.values(nets).forEach((netInfo) => {
//     ;(netInfo || []).forEach((net) => {
//       // IPv4, 내부 아님
//       if (net.family === 'IPv4' && !net.internal) {
//         results.push(net.address)
//       }
//     })
//   })

//   return results
// }

// interface JSONError {
//   errorMessage: string
// }


export async function getJsonData<T>(configName: string): Promise<T> {
     try {
       // console.log('root dir2:', process.cwd())
       // console.log('file path:', join(process.cwd(),'electron', 'data',`${configName}.json`))
       
       const data = await fs.readFile(join(process.cwd(),'electron', 'data',`${configName}.json`), 'utf-8')
       return JSON.parse(data)
     } catch (error) {
      //  console.error('File Read Error:', error)
       throw error 
     }
}