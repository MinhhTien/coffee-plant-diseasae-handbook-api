import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { LearnerStatus } from '@common/contracts/constant'

export type LearnerDocument = HydratedDocument<Learner>

@Schema({
  collection: 'learners',
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
export class Learner {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true })
  email: string

  @Prop({ type: String, required: true, select: false })
  password: string

  @Prop({ type: String })
  avatar: string

  @Prop({ type: Date })
  dateOfBirth: Date

  @Prop({ type: String })
  phone: string

  @Prop({
    enum: LearnerStatus,
    default: LearnerStatus.UNVERIFIED
  })
  status: LearnerStatus
}

export const LearnerSchema = SchemaFactory.createForClass(Learner)

LearnerSchema.plugin(paginate)
LearnerSchema.index({ email: 1 })
LearnerSchema.index({ name: 'text', email: 'text' })