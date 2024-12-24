import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'

export type SettingDocument = HydratedDocument<Setting>

@Schema({
  collection: 'settings',
  timestamps: {
    createdAt: true,
    updatedAt: true
  },
  toJSON: {
    transform(doc, ret) {
      delete ret.__v
    }
  }
})
export class Setting {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  key: string

  @Prop({ type: Types.Map, required: true })
  value: string | Record<string, any> | number | Array<number | String>

  @Prop({ type: Boolean, required: true, default: true })
  enabled: boolean
}

export const SettingSchema = SchemaFactory.createForClass(Setting)
SettingSchema.plugin(paginate)
SettingSchema.index({ key: 1 })
