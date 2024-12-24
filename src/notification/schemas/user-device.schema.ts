import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { UserDeviceStatus, UserRole } from '@common/contracts/constant'

export type UserDeviceDocument = HydratedDocument<UserDevice>

@Schema({
  collection: 'user-devices',
  timestamps: {
    createdAt: true,
    updatedAt: true
  },
  toJSON: {
    transform(doc, ret) {
      delete ret.__v
    },
    virtuals: true
  }
})
export class UserDevice {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId

  @Prop({ type: String, enum: UserRole, required: true })
  userRole: UserRole

  @Prop({ type: String, required: true })
  fcmToken: string

  @Prop({ type: String })
  browser: string

  @Prop({ type: String })
  os: string

  @Prop({
    enum: UserDeviceStatus,
    default: UserDeviceStatus.ACTIVE
  })
  status: UserDeviceStatus
}

export const UserDeviceSchema = SchemaFactory.createForClass(UserDevice)
UserDeviceSchema.plugin(paginate)
// UserDeviceSchema.index({ userId: 1, userRole: 1 })
