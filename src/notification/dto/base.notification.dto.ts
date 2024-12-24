import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class BaseNotificationDto {
  @ApiProperty({ type: String })
  @IsString()
  _id: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly title: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly body: string

  @ApiProperty({ type: Object })
  readonly data: {
    [key: string]: string
  }

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsMongoId({ each: true })
  readonly receiverIds: string[]

  @ApiProperty({ type: String })
  @IsString()
  readonly topic: string

  @ApiProperty({ type: Date })
  createdAt?: Date
}
