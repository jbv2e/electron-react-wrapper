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
