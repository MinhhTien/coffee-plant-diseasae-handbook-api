import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { ReportTag, ReportType } from '@report/contracts/constant'

export type ReportDocument = HydratedDocument<Report>

@Schema({
  collection: 'reports',
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
export class Report {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id?: string

  @Prop({ type: String, enum: ReportType, required: true })
  type: ReportType

  @Prop({ type: String, enum: ReportTag, required: true })
  tag: ReportTag

  @Prop({ type: Types.ObjectId })
  ownerId: Types.ObjectId

  @Prop({ type: Types.Map, required: true })
  data: Record<string, any>
}

export const ReportSchema = SchemaFactory.createForClass(Report)
ReportSchema.plugin(paginate)
ReportSchema.index({ type: 1, tag: 1 })
