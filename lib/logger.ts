import fs from 'fs'
import path from 'path'

export function logToFile(message: string) {
  const logPath = path.join(process.cwd(), 'debug_logs.txt')
  const timestamp = new Date().toISOString()
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`)
}
