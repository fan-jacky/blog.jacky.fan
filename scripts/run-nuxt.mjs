import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { spawn } from 'node:child_process'

const tmpRoot = process.platform === 'darwin' ? '/tmp' : process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp'
const nuxtTmpDir = join(tmpRoot, 'nuxt-jacky')

mkdirSync(nuxtTmpDir, { recursive: true })

const env = {
  ...process.env,
  TMPDIR: nuxtTmpDir,
  TMP: nuxtTmpDir,
  TEMP: nuxtTmpDir,
}

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const child = spawn(pnpmCommand, ['exec', 'nuxt', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})

child.on('error', (error) => {
  console.error(error)
  process.exit(1)
})