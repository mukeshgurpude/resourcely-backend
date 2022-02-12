import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose'
import Ibase from '@ctypes/base'


function schema_factory<Type>(definition: SchemaDefinition, options: SchemaOptions = {}): Schema {
  const schema = new Schema<Ibase | Type>({
    expires_at: {
      type: Date,
      default: Date.now,
      expires: '5m'
    },
    shortcode: { type: String, required: true },
    ...definition
  }, {
    timestamps: true,
    ...options
  })
  schema.index({ expires_at: 1 }, {expireAfterSeconds: 0})
  schema.index({shortcode: 1})
  return schema
}

export default schema_factory
