import { hashSync, compareSync, genSaltSync } from 'bcrypt'

/* istanbul ignore next */
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10

export function hash(str: string) {
  const salt = genSaltSync(SALT_ROUNDS)
  return hashSync(str, salt)
}

export function compare(str: string, hash: string) {
  return compareSync(str, hash)
}
