import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'

export type HeritageDocument = HydratedDocument<Heritage>

@Schema({
  collection: 'heritages',
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
export class Heritage {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true, unique: true })
  name: string

  @Prop({ type: String, required: true })
  slug: string

  @Prop({ type: String, required: true })
  shortDescription: string

  @Prop({ type: String })
  detailedDescription: string

  @Prop({ type: String }) // tangible or intangible
  type: string

  @Prop({ type: String }) // tangible
  location: string

  @Prop({ type: Date }) // tangible
  creationTime: Date

  @Prop({ type: String }) // tangible
  origin: string

  @Prop({ type: String }) // Các giá trị tiêu biểu của di sản (lịch sử, văn hóa, khoa học,...)
  typicalValue: string

  @Prop({ type: String })
  image: string

  @Prop({ type: String }) // intangible
  video: string

  @Prop({ type: String }) // intangible
  relatedCommunity: string

  @Prop({ type: String })
  audioUrl: string

  @Prop({ type: String })
  modelUrl: string
}

export const HeritageSchema = SchemaFactory.createForClass(Heritage)

HeritageSchema.plugin(paginate)
HeritageSchema.index({ type: 1, slug: 1 })
HeritageSchema.index({ name: 'text', shortDescription: 'text', note: 'text' })
