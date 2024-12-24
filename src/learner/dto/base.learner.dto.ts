import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { LearnerStatus } from '@common/contracts/constant'
import { EmailDto } from '@common/dto/email.dto'
import { PastYear } from '@common/validators/past-year.validator'

export class BaseLearnerDto extends EmailDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @IsStrongPassword()
  password: string

  @ApiProperty({ type: String })
  @IsOptional()
  @IsUrl()
  avatar: string

  @ApiProperty({ type: Date })
  @PastYear(10)
  dateOfBirth: Date

  @ApiProperty({ type: String })
  @Matches(/^[+]?\d{10,12}$/)
  phone: string

  @ApiProperty({ type: String, enum: LearnerStatus })
  @IsEnum(LearnerStatus)
  status: LearnerStatus

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
