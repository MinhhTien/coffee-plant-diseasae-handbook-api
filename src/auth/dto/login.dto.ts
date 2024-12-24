import { UserRole } from '@common/contracts/constant'
import { EmailDto } from '@common/dto/email.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsIn, IsString, MaxLength, MinLength } from 'class-validator'

export class LoginDto extends EmailDto {
  @ApiProperty({ example: '123456789' })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string
}

export class ManagementLoginDto extends LoginDto {
  @ApiProperty({ enum: [UserRole.ACCOUNT, UserRole.ACCOUNT, UserRole.ACCOUNT] })
  @IsIn([UserRole.ACCOUNT, UserRole.ACCOUNT, UserRole.ACCOUNT])
  role: UserRole
}
