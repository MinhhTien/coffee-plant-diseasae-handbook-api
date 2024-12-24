import { UserRole } from '@common/contracts/constant'
import { Types } from 'mongoose'

export class CreateUserTokenDto {
  userId: Types.ObjectId
  role: UserRole
  refreshToken: string
}
