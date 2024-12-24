import { IsMongoId } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ReportTag, ReportType } from '@report/contracts/constant'

export class BaseReportDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String, enum: ReportType })
  type: ReportType

  @ApiProperty({ type: String, enum: ReportTag })
  tag: ReportTag

  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  ownerId: string

  @ApiProperty({ type: Object })
  data: Record<string, any>
}
