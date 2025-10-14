
import { app } from 'electron'
import fs from 'fs/promises'
import { dirname, join } from 'path'

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


function resolveDataPaths(filename: string): string[] {
  const candidates = new Set<string>()

  if (app.isPackaged) {
    const exeDir = dirname(process.execPath)

    // console.log('process.resourcesPath : ' + process.resourcesPath)
    // console.log('exeDir : ' + exeDir)
    candidates.add(join(exeDir, 'data', filename))
    candidates.add(join(process.resourcesPath, 'data', filename))
  }

  candidates.add(join(process.cwd(), 'electron', 'data', filename))
  candidates.add(join(app.getAppPath(), 'electron', 'data', filename))

  return Array.from(candidates)
}

export async function getJsonData<T>(configName: string): Promise<T> {
  const fileName = `${configName}.json`
  const paths = resolveDataPaths(fileName)

  for (const candidate of paths) {
    try {
      const data = await fs.readFile(candidate, 'utf-8')
      return JSON.parse(data)
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'ENOENT'
      ) {
        continue
      }

      throw error
    }
  }

  throw new Error(`Unable to locate ${fileName} in paths: ${paths.join(', ')}`)
}
