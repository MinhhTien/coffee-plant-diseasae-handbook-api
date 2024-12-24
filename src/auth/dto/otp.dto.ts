import { UserRole } from '@common/contracts/constant'
import { Types } from 'mongoose'

export class CreateOtpDto {
  userId: Types.ObjectId
  role: UserRole
  code: string
  expiredAt: Date
}
