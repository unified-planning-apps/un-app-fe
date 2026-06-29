/**
 * src/lib/password-generator.ts
 * ===============================
 * Client-side strong password generator. Used when an admin provisions a
 * national/regional account — see routes/admin/_admin/users/create.
 */

const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const LOWER = 'abcdefghijkmnpqrstuvwxyz'
const DIGITS = '23456789'
const SYMBOLS = '!@#$%^&*-_=+?'

function randomChar(charset: string): string {
  return charset[Math.floor(Math.random() * charset.length)]
}

/** Generates a strong, human-typeable password (no ambiguous characters like 0/O, 1/l/I). */
export function generateStrongPassword(length = 14): string {
  const all = UPPER + LOWER + DIGITS + SYMBOLS
  const required = [randomChar(UPPER), randomChar(LOWER), randomChar(DIGITS), randomChar(SYMBOLS)]
  const rest = Array.from({ length: Math.max(0, length - required.length) }, () => randomChar(all))
  const chars = [...required, ...rest]

  // Shuffle (Fisher-Yates)
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}
