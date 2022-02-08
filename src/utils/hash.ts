import { hashSync, compareSync, genSaltSync } from 'bcrypt'

export function hash(str: string) {
  const salt = genSaltSync(parseInt(process.env.HASH_SALT_ROUNDS) ?? 10)
  return hashSync(str, salt)
}

export function compare(str: string, hash: string) {
  return compareSync(str, hash)
}
