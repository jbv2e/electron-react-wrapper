const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('📦 Creating optimized offline bundle...\n')

// 1. 검증
console.log('1️⃣ Verifying installation')
if (!fs.existsSync('node_modules')) {
  throw new Error('Run npm ci first')
}

// 2. Electron 확인
const electronBin =
  process.platform === 'win32' ? 'node_modules/electron/dist/electron.exe' : 'node_modules/electron/dist/electron'

if (!fs.existsSync(electronBin)) {
  throw new Error('❌ Electron binary missing')
}

const electronSize = fs.statSync(electronBin).size
console.log(`✅ Electron: ${(electronSize / 1024 / 1024).toFixed(1)}MB`)

// 3. 불필요한 파일 제거
console.log('\n2️⃣ Cleaning up')
const patterns = [
  'node_modules/**/.github',
  'node_modules/**/test',
  'node_modules/**/tests',
  'node_modules/**/__tests__',
  'node_modules/**/*.md',
  'node_modules/**/LICENSE',
  'node_modules/**/.DS_Store',
]

let savedSpace = 0
patterns.forEach((pattern) => {
  try {
    const cmd =
      process.platform === 'win32'
        ? `powershell -Command "Remove-Item '${pattern}' -Recurse -Force -ErrorAction SilentlyContinue"`
        : `find node_modules -path "${pattern}" -delete 2>/dev/null || true`
    execSync(cmd)
  } catch (e) {}
})

// 4. 압축
console.log('\n3️⃣ Creating archive')
const files = ['node_modules', 'package.json', 'package-lock.json']

execSync(`tar -czf offline-bundle.tar.gz ${files.join(' ')}`, {
  stdio: 'inherit',
})

const bundleSize = fs.statSync('offline-bundle.tar.gz').size
console.log(`\n✅ Bundle created: ${(bundleSize / 1024 / 1024).toFixed(1)}MB`)

// 5. 체크섬 생성
const crypto = require('crypto')
const hash = crypto.createHash('sha256')
hash.update(fs.readFileSync('offline-bundle.tar.gz'))
const checksum = hash.digest('hex')

fs.writeFileSync('offline-bundle.sha256', `${checksum}  offline-bundle.tar.gz\n`)

console.log(`📝 Checksum: ${checksum.substring(0, 16)}...`)
console.log('\n🎉 Ready for offline deployment!')
