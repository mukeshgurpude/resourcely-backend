import { model, models } from 'mongoose'
import IText from '@ctypes/text'
import { SHORTCODE_PREFIXES } from '@utils/constants'
import schema_factory from './base'

const text_schema = schema_factory<IText>({
  text: { type: String, required: true },
  language: { type: String, required: true, default: 'plain' }
}, SHORTCODE_PREFIXES.text)

const Text = models.Text || model<IText>('Text', text_schema)

export default Text
