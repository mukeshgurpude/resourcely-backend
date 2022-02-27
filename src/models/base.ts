import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose'
import generate_id from '@utils/random'
import Ibase from '@ctypes/base'


function schema_factory<Type>(definition: SchemaDefinition, prefix: string, options: SchemaOptions = {}): Schema {
  const schema = new Schema<Ibase | Type>({
    description: String,
    expires_at: { type: Date, default: Date.now },
    password: String,
    shortcode: { type: String, required: true },
    title: { type: String, required: true },
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
