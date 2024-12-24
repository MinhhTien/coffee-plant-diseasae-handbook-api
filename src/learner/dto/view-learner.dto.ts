import { ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseLearnerDto } from './base.learner.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import {
  ACCOUNT_DETAIL_PROJECTION,
  ACCOUNT_LIST_PROJECTION,
  ACCOUNT_PROFILE_PROJECTION
} from '@learner/contracts/constant'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { LearnerStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'

export class QueryLearnerDto {
  @ApiPropertyOptional({
    description: 'Name to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiPropertyOptional({
    description: 'Email to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  email: string

  @ApiPropertyOptional({
    enum: [LearnerStatus.ACTIVE, LearnerStatus.INACTIVE],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: LearnerStatus[]
}

class LearnerProfileResponse extends PickType(BaseLearnerDto, ACCOUNT_PROFILE_PROJECTION) {}
export class LearnerProfileDataResponse extends DataResponse(LearnerProfileResponse) {}

export class LearnerDetailResponse extends PickType(BaseLearnerDto, ACCOUNT_DETAIL_PROJECTION) {}
export class LearnerDetailDataResponse extends DataResponse(LearnerDetailResponse) {}

class LearnerListItemResponse extends PickType(BaseLearnerDto, ACCOUNT_LIST_PROJECTION) {}
class LearnerListResponse extends PaginateResponse(LearnerListItemResponse) {}
export class LearnerListDataResponse extends DataResponse(LearnerListResponse) {}
