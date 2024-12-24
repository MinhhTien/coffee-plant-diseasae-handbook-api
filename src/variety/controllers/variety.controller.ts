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
import { VarietyStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { IUserTokenService } from '@auth/services/user-token.service'
import { Types } from 'mongoose'
import { IVarietyService } from '@variety/services/variety.service'
import { VarietyDetailDataResponse, VarietyListDataResponse, QueryVarietyDto } from '@variety/dto/view-variety.dto'
import { VARIETY_DETAIL_PROJECTION } from '@variety/contracts/constant'
import { IReportService } from '@report/services/report.service'
import { ReportTag, ReportType } from '@report/contracts/constant'

@ApiTags('Variety - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
// @UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('')
export class VarietyController {
  constructor(
    @Inject(IVarietyService)
    private readonly varietyService: IVarietyService,
    @Inject(IUserTokenService)
    private readonly userTokenService: IUserTokenService,
    @Inject(IReportService)
    private readonly reportService: IReportService
  ) {}

  @ApiOperation({
    summary: `View Variety List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: VarietyListDataResponse })
  // @Roles(UserRole.ACCOUNT)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryVarietyDto: QueryVarietyDto) {
    return await this.varietyService.list(pagination, queryVarietyDto)
  }

  @ApiOperation({
    summary: `View Variety Detail`
  })
  @ApiOkResponse({ type: VarietyDetailDataResponse })
  @ApiErrorResponse([Errors.ACCOUNT_NOT_FOUND])
  @Roles(UserRole.ACCOUNT)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') varietyId: string) {
    const variety = await this.varietyService.findById(varietyId, VARIETY_DETAIL_PROJECTION)
    if (!variety) throw new AppException(Errors.ACCOUNT_NOT_FOUND)

    return variety
  }

  // @ApiOperation({
  //   summary: `[${UserRole.ACCOUNT}] Deactivate Variety`
  // })
  // @ApiOkResponse({ type: SuccessDataResponse })
  // @Roles(UserRole.ACCOUNT)
  // @Patch('/:id([0-9a-f]{24})/deactivate')
  // async deactivate(@Param('id') varietyId: string) {
  //   await Promise.all([
  //     this.varietyService.update(
  //       {
  //         _id: varietyId
  //       },
  //       { status: VarietyStatus.INACTIVE }
  //     ),
  //     this.userTokenService.clearAllRefreshTokensOfUser(new Types.ObjectId(varietyId), UserRole.ACCOUNT),
  //     // update variety report
  //     this.reportService.update(
  //       { type: ReportType.VarietySum, tag: ReportTag.System },
  //       {
  //         $inc: {
  //           [`data.${VarietyStatus.ACTIVE}.quantity`]: -1,
  //           [`data.${VarietyStatus.INACTIVE}.quantity`]: 1
  //         }
  //       }
  //     )
  //   ])
  //   return new SuccessResponse(true)
  // }

  // @ApiOperation({
  //   summary: `[${UserRole.ACCOUNT}] Activate Variety`
  // })
  // @ApiOkResponse({ type: SuccessDataResponse })
  // @Roles(UserRole.ACCOUNT)
  // @Patch('/:id([0-9a-f]{24})/active')
  // async activate(@Param('id') varietyId: string) {
  //   await this.varietyService.update(
  //     {
  //       _id: varietyId
  //     },
  //     { status: VarietyStatus.ACTIVE }
  //   )
  //   // update variety report
  //   this.reportService.update(
  //     { type: ReportType.VarietySum, tag: ReportTag.System },
  //     {
  //       $inc: {
  //         [`data.${VarietyStatus.ACTIVE}.quantity`]: 1,
  //         [`data.${VarietyStatus.INACTIVE}.quantity`]: -1
  //       }
  //     }
  //   )
  //   return new SuccessResponse(true)
  // }
}
