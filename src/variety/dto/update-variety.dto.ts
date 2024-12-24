import { PartialType, PickType } from '@nestjs/swagger'
import { BaseVarietyDto } from './base.variety.dto'

export class UpdateVarietyDto extends PartialType(PickType(BaseVarietyDto, ['name', 'description'])) {}
