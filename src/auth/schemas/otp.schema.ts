import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { UserRole } from '@common/contracts/constant'

export type OtpDocument = HydratedDocument<Otp>

@Schema({
  collection: 'otps',
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
export class Otp {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true })
  code: string

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId

  @Prop({ type: String, enum: UserRole, required: true })
  role: UserRole

  @Prop({ type: Date, required: true })
  expiredAt: Date
}

export const OtpSchema = SchemaFactory.createForClass(Otp)

OtpSchema.plugin(paginate)
