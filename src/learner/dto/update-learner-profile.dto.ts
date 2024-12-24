import { PartialType, PickType } from '@nestjs/swagger'
import { BaseLearnerDto } from './base.learner.dto'

export class UpdateLearnerProfileDto extends PartialType(
  PickType(BaseLearnerDto, ['name', 'avatar', 'dateOfBirth', 'phone'])
) {}
