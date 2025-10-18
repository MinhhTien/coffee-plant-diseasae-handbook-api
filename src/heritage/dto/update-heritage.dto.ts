import { PartialType, PickType } from '@nestjs/swagger'
import { BaseHeritageDto } from './base.heritage.dto'

export class UpdateHeritageDto extends PartialType(PickType(BaseHeritageDto, ['name'] as const)) {}
