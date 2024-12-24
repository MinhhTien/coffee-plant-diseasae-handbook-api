import { IsMongoId } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class BaseSettingDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String, example: 'Setting key' })
  key: string

  @ApiProperty({ type: String, example: 'Setting value' })
  value: string

  @ApiPropertyOptional({ type: Boolean })
  enabled: Boolean
}
