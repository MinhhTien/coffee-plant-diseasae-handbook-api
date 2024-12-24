import { EmailDto } from '@common/dto/email.dto'
import { BaseLearnerDto } from '@learner/dto/base.learner.dto'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class LearnerRegisterDto extends PickType(BaseLearnerDto, [
  'name',
  'email',
  'password',
  // 'dateOfBirth',
  // 'phone'
]) {}

export class LearnerVerifyAccountDto extends EmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string
}

export class LearnerResendOtpDto extends EmailDto {}
