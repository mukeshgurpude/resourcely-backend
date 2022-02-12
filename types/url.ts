import IBase from './base'

interface UrlModel extends IBase {
  original_url: string
  password?: string
}

export default UrlModel
