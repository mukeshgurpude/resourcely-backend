import { Request } from 'express'

interface IModifiedRequest extends Request {
  resource_metadata: {
    [key: string]: string
  }
}

export default IModifiedRequest
