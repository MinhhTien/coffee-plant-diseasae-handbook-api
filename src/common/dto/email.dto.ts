import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, isString, MaxLength } from 'class-validator'

export class EmailDto {
  @ApiProperty({ type: String })
  @IsEmail()
  @MaxLength(50)
  @Transform(({ value }) => {
    if (isString(value)) return value.toLowerCase()
    return value
  })
  email: string
}
