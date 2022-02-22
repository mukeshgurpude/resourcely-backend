import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose'
import generate_id from '@utils/random'
import Ibase from '@ctypes/base'


function schema_factory<Type>(definition: SchemaDefinition, options: SchemaOptions = {}, prefix=''): Schema {
  const schema = new Schema<Ibase | Type>({
    expires_at: {
      type: Date,
      default: Date.now
    },
    password: String,
    shortcode: { type: String, required: true },
    ...definition
  }, {
    timestamps: true,
    ...options
  })
  schema.index({ expires_at: 1 }, { expireAfterSeconds: 0 })
  schema.index({ shortcode: 1 }, { unique: true })
  schema.pre('validate', function(next) {
    const doc = this as Ibase
    doc.shortcode = prefix + generate_id()
    next()
  })
  return schema
}

export default schema_factory
