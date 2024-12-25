import { ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseDiseaseDto } from './base.disease.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { DISEASE_DETAIL_PROJECTION, DISEASE_LIST_PROJECTION } from '@disease/contracts/constant'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class QueryDiseaseDto {
  @ApiPropertyOptional({
    description: 'Search key'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search: string
}

export class DiseaseDetailResponse extends PickType(BaseDiseaseDto, DISEASE_DETAIL_PROJECTION) {}
export class DiseaseDetailDataResponse extends DataResponse(DiseaseDetailResponse) {}

class DiseaseListItemResponse extends PickType(BaseDiseaseDto, DISEASE_LIST_PROJECTION) {}
class DiseaseListResponse extends PaginateResponse(DiseaseListItemResponse) {}
export class DiseaseListDataResponse extends DataResponse(DiseaseListResponse) {}
