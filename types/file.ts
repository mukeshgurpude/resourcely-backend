import IBase from './base'

interface IFile extends IBase {
  path: string,
  name: string,
  type: string
}

export default IFile
