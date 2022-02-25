import { model, models } from 'mongoose'
import IText from '@ctypes/text'
import schema_factory from '@src/models/base'
import { SHORTCODE_PREFIXES } from '@utils/constants'

const text_schema = schema_factory<IText>({
  text: { type: String, required: true }
}, {}, SHORTCODE_PREFIXES.text)

const Text = models.Text || model<IText>('Text', text_schema)

export default Text
