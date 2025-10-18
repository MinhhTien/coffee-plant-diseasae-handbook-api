import { ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseHeritageDto } from './base.heritage.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { HERITAGE_DETAIL_PROJECTION, HERITAGE_LIST_PROJECTION } from '@heritage/contracts/constant'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class QueryHeritageDto {
  @ApiPropertyOptional({
    description: 'Search key'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search: string

  @ApiPropertyOptional({
    description: 'Heritage type'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  type: string
}

export class HeritageDetailResponse extends PickType(BaseHeritageDto, HERITAGE_DETAIL_PROJECTION) {}
export class HeritageDetailDataResponse extends DataResponse(HeritageDetailResponse) {}

class HeritageListItemResponse extends PickType(BaseHeritageDto, HERITAGE_LIST_PROJECTION) {}
class HeritageListResponse extends PaginateResponse(HeritageListItemResponse) {}
export class HeritageListDataResponse extends DataResponse(HeritageListResponse) {}
