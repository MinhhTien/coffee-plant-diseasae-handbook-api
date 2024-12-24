import { ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseVarietyDto } from './base.variety.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { VARIETY_DETAIL_PROJECTION, VARIETY_LIST_PROJECTION } from '@variety/contracts/constant'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class QueryVarietyDto {
  @ApiPropertyOptional({
    description: 'Search key'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search: string

  // @ApiPropertyOptional({
  //   enum: [VarietyStatus.ACTIVE, VarietyStatus.INACTIVE],
  //   isArray: true
  // })
  // @IsOptional()
  // @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  // status: VarietyStatus[]
}

export class VarietyDetailResponse extends PickType(BaseVarietyDto, VARIETY_DETAIL_PROJECTION) {}
export class VarietyDetailDataResponse extends DataResponse(VarietyDetailResponse) {}

class VarietyListItemResponse extends PickType(BaseVarietyDto, VARIETY_LIST_PROJECTION) {}
class VarietyListResponse extends PaginateResponse(VarietyListItemResponse) {}
export class VarietyListDataResponse extends DataResponse(VarietyListResponse) {}
