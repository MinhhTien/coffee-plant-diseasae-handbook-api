import { Controller, Get, UseGuards, Inject, Put, Body, Post, Query, Param, Patch } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import * as _ from 'lodash'

import {
  ErrorResponse,
  IDDataResponse,
  IDResponse,
  PaginationQuery,
  SuccessDataResponse,
  SuccessResponse
} from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { IUserTokenService } from '@auth/services/user-token.service'
import { Types } from 'mongoose'
import { IDiseaseService } from '@disease/services/disease.service'
import { DiseaseDetailDataResponse, DiseaseListDataResponse, QueryDiseaseDto } from '@disease/dto/view-disease.dto'
import { DISEASE_DETAIL_PROJECTION } from '@disease/contracts/constant'
import { IReportService } from '@report/services/report.service'
import { ReportTag, ReportType } from '@report/contracts/constant'

@ApiTags('Disease - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
// @UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('')
export class DiseaseController {
  constructor(
    @Inject(IDiseaseService)
    private readonly diseaseService: IDiseaseService,
    @Inject(IUserTokenService)
    private readonly userTokenService: IUserTokenService,
    @Inject(IReportService)
    private readonly reportService: IReportService
  ) {}

  @ApiOperation({
    summary: `View Disease List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: DiseaseListDataResponse })
  // @Roles(UserRole.ACCOUNT)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryDiseaseDto: QueryDiseaseDto) {
    return await this.diseaseService.list(pagination, queryDiseaseDto)
  }

  @ApiOperation({
    summary: `View Disease Detail`
  })
  @ApiOkResponse({ type: DiseaseDetailDataResponse })
  @ApiErrorResponse([Errors.ACCOUNT_NOT_FOUND])
  @Roles(UserRole.ACCOUNT)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') diseaseId: string) {
    const disease = await this.diseaseService.findById(diseaseId, DISEASE_DETAIL_PROJECTION)
    if (!disease) throw new AppException(Errors.ACCOUNT_NOT_FOUND)

    return disease
  }

  // @ApiOperation({
  //   summary: `[${UserRole.ACCOUNT}] Deactivate Disease`
  // })
  // @ApiOkResponse({ type: SuccessDataResponse })
  // @Roles(UserRole.ACCOUNT)
  // @Patch('/:id([0-9a-f]{24})/deactivate')
  // async deactivate(@Param('id') diseaseId: string) {
  //   await Promise.all([
  //     this.diseaseService.update(
  //       {
  //         _id: diseaseId
  //       },
  //       { status: DiseaseStatus.INACTIVE }
  //     ),
  //     this.userTokenService.clearAllRefreshTokensOfUser(new Types.ObjectId(diseaseId), UserRole.ACCOUNT),
  //     // update disease report
  //     this.reportService.update(
  //       { type: ReportType.DiseaseSum, tag: ReportTag.System },
  //       {
  //         $inc: {
  //           [`data.${DiseaseStatus.ACTIVE}.quantity`]: -1,
  //           [`data.${DiseaseStatus.INACTIVE}.quantity`]: 1
  //         }
  //       }
  //     )
  //   ])
  //   return new SuccessResponse(true)
  // }

  // @ApiOperation({
  //   summary: `[${UserRole.ACCOUNT}] Activate Disease`
  // })
  // @ApiOkResponse({ type: SuccessDataResponse })
  // @Roles(UserRole.ACCOUNT)
  // @Patch('/:id([0-9a-f]{24})/active')
  // async activate(@Param('id') diseaseId: string) {
  //   await this.diseaseService.update(
  //     {
  //       _id: diseaseId
  //     },
  //     { status: DiseaseStatus.ACTIVE }
  //   )
  //   // update disease report
  //   this.reportService.update(
  //     { type: ReportType.DiseaseSum, tag: ReportTag.System },
  //     {
  //       $inc: {
  //         [`data.${DiseaseStatus.ACTIVE}.quantity`]: 1,
  //         [`data.${DiseaseStatus.INACTIVE}.quantity`]: -1
  //       }
  //     }
  //   )
  //   return new SuccessResponse(true)
  // }
}
