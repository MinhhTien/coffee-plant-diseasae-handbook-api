import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { VarietyStatus } from '@common/contracts/constant'

export type VarietyDocument = HydratedDocument<Variety>

@Schema({
  collection: 'varieties',
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
export class Variety {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true, unique: true })
  name: string

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: String, required: true })
  scientificName: string

  @Prop({ type: String, required: true })
  origin: string

  @Prop({ type: String, required: true })
  distribution: string

  @Prop({ type: String, required: true })
  suitableClimate: string

  @Prop({ type: String, required: true })
  height: string

  @Prop({ type: String, required: true })
  leaf: string

  @Prop({ type: String, required: true })
  bean: string

  @Prop({ type: String, required: true })
  flavor: string

  @Prop({ type: String, required: true })
  image: string

  @Prop({
    enum: VarietyStatus,
    default: VarietyStatus.ACTIVE
  })
  status: VarietyStatus
}

export const VarietySchema = SchemaFactory.createForClass(Variety)

VarietySchema.plugin(paginate)
VarietySchema.index({ name: 'text', description: 'text' })
