import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { UserRole } from '@common/contracts/constant'

export type UserTokenDocument = HydratedDocument<UserToken>

@Schema({
  collection: 'user-tokens',
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
export class UserToken {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId

  @Prop({ type: String, enum: UserRole, required: true })
  role: UserRole

  @Prop({ type: String, required: true })
  refreshToken: string

  @Prop({ type: Boolean, default: true })
  enabled: boolean
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken)

UserTokenSchema.plugin(paginate)
