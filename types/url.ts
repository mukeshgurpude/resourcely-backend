import IBase from './base'

interface IUrl extends IBase {
  original_url: string
  password?: string
}

export default IUrl
