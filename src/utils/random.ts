import { config } from 'dotenv'
import { customRandom, random, urlAlphabet } from 'nanoid'

config()

export default function generate_id() {
  const nanoid = customRandom(urlAlphabet, parseInt(process.env.ID_LENGTH) || 8, random)
  return nanoid()
}
