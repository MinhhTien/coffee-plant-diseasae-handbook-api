import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { USER_DEVICE_LIST_PROJECTION } from '@notification/contracts/constant'
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { UserDeviceStatus, UserRole } from '@common/contracts/constant'
import { Types } from 'mongoose'

export class BaseUserDeviceDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String })
  @IsMongoId()
  userId: Types.ObjectId

  @ApiProperty({ type: String })
  @IsEnum(UserRole)
  userRole: UserRole

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  fcmToken: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  browser: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  os: string

  @ApiProperty({ type: String })
  @IsEnum(UserDeviceStatus)
  status: UserDeviceStatus

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}

export class CreateUserDeviceDto extends PickType(BaseUserDeviceDto, ['fcmToken', 'browser', 'os']) {
  userId: Types.ObjectId
  userRole: UserRole
}

class UserDeviceDetailResponse extends PickType(BaseUserDeviceDto, USER_DEVICE_LIST_PROJECTION) {}
export class UserDeviceDetailDataResponse extends DataResponse(UserDeviceDetailResponse) {}
