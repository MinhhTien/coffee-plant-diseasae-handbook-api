import { ApiProperty, PickType } from '@nestjs/swagger'
import { BaseReportDto } from './base.report.dto'

export class CreateUserReportDto extends PickType(BaseReportDto, ['type', 'tag', 'ownerId']) {
  @ApiProperty({ type: Object })
  data: Record<string, any>
}
