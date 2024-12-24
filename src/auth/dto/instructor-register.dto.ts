import { EmailDto } from '@common/dto/email.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength } from 'class-validator'

export class InstructorRegisterDto extends EmailDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiProperty({ type: String })
  @Matches(/^[+]?\d{10,12}$/)
  phone: string

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  cv: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string
}
