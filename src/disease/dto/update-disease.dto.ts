import { PartialType, PickType } from '@nestjs/swagger'
import { BaseDiseaseDto } from './base.disease.dto'

export class UpdateDiseaseDto extends PartialType(
  PickType(BaseDiseaseDto, ['name', 'reason', 'description', 'symptoms', 'location', 'time', 'preventions'] as const)
) {}
