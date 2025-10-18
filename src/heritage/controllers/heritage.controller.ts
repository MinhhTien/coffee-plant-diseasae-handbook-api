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
import { IHeritageService } from '@heritage/services/heritage.service'
import { HeritageDetailDataResponse, HeritageListDataResponse, QueryHeritageDto } from '@heritage/dto/view-heritage.dto'
import { HERITAGE_DETAIL_PROJECTION } from '@heritage/contracts/constant'
import { IReportService } from '@report/services/report.service'
import { ReportTag, ReportType } from '@report/contracts/constant'

@ApiTags('Heritage - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
// @UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('')
export class HeritageController {
  constructor(
    @Inject(IHeritageService)
    private readonly heritageService: IHeritageService,
    @Inject(IUserTokenService)
    private readonly userTokenService: IUserTokenService,
    @Inject(IReportService)
    private readonly reportService: IReportService
  ) {}

  @ApiOperation({
    summary: `View Heritage List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: HeritageListDataResponse })
  // @Roles(UserRole.ACCOUNT)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryHeritageDto: QueryHeritageDto) {
    return await this.heritageService.list(pagination, queryHeritageDto)
  }

  @ApiOperation({
    summary: `View Heritage Detail`
  })
  @ApiOkResponse({ type: HeritageDetailDataResponse })
  @ApiErrorResponse([Errors.OBJECT_NOT_FOUND])
  // @Roles(UserRole.ACCOUNT)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') heritageId: string) {
    const heritage = await this.heritageService.findById(heritageId, HERITAGE_DETAIL_PROJECTION)
    if (!heritage) throw new AppException(Errors.OBJECT_NOT_FOUND)

    return heritage
  }

  @ApiOperation({
    summary: `View Heritage Detail By Slug`
  })
  @ApiOkResponse({ type: HeritageDetailDataResponse })
  @ApiErrorResponse([Errors.OBJECT_NOT_FOUND])
  // @Roles(UserRole.ACCOUNT)
  @Get(':slug([0-9a-zA-Z-_]+)')
  async getDetailBySlug(@Param('slug') slug: string) {
    const heritage = await this.heritageService.findBySlug(slug, HERITAGE_DETAIL_PROJECTION)
    if (!heritage) throw new AppException(Errors.OBJECT_NOT_FOUND)

    return heritage
  }

  // @ApiOperation({
  //   summary: `[${UserRole.ACCOUNT}] Deactivate Heritage`
  // })
  // @ApiOkResponse({ type: SuccessDataResponse })
  // @Roles(UserRole.ACCOUNT)
  // @Patch('/:id([0-9a-f]{24})/deactivate')
  // async deactivate(@Param('id') heritageId: string) {
  //   await Promise.all([
  //     this.heritageService.update(
  //       {
  //         _id: heritageId
  //       },
  //       { status: HeritageStatus.INACTIVE }
  //     ),
  //     this.userTokenService.clearAllRefreshTokensOfUser(new Types.ObjectId(heritageId), UserRole.ACCOUNT),
  //     // update heritage report
  //     this.reportService.update(
  //       { type: ReportType.HeritageSum, tag: ReportTag.System },
  //       {
  //         $inc: {
  //           [`data.${HeritageStatus.ACTIVE}.quantity`]: -1,
  //           [`data.${HeritageStatus.INACTIVE}.quantity`]: 1
  //         }
  //       }
  //     )
  //   ])
  //   return new SuccessResponse(true)
  // }

  // @ApiOperation({
  //   summary: `[${UserRole.ACCOUNT}] Activate Heritage`
  // })
  // @ApiOkResponse({ type: SuccessDataResponse })
  // @Roles(UserRole.ACCOUNT)
  // @Patch('/:id([0-9a-f]{24})/active')
  // async activate(@Param('id') heritageId: string) {
  //   await this.heritageService.update(
  //     {
  //       _id: heritageId
  //     },
  //     { status: HeritageStatus.ACTIVE }
  //   )
  //   // update heritage report
  //   this.reportService.update(
  //     { type: ReportType.HeritageSum, tag: ReportTag.System },
  //     {
  //       $inc: {
  //         [`data.${HeritageStatus.ACTIVE}.quantity`]: 1,
  //         [`data.${HeritageStatus.INACTIVE}.quantity`]: -1
  //       }
  //     }
  //   )
  //   return new SuccessResponse(true)
  // }
}
