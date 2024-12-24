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
import { LearnerStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { IUserTokenService } from '@auth/services/user-token.service'
import { Types } from 'mongoose'
import { ILearnerService } from '@learner/services/learner.service'
import { LearnerDetailDataResponse, LearnerListDataResponse, QueryLearnerDto } from '@learner/dto/view-learner.dto'
import { ACCOUNT_DETAIL_PROJECTION } from '@learner/contracts/constant'
import { IReportService } from '@report/services/report.service'
import { ReportTag, ReportType } from '@report/contracts/constant'

@ApiTags('Learner - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementLearnerController {
  constructor(
    @Inject(ILearnerService)
    private readonly learnerService: ILearnerService,
    @Inject(IUserTokenService)
    private readonly userTokenService: IUserTokenService,
    @Inject(IReportService)
    private readonly reportService: IReportService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Learner List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: LearnerListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryLearnerDto: QueryLearnerDto) {
    return await this.learnerService.list(pagination, queryLearnerDto)
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Learner Detail`
  })
  @ApiOkResponse({ type: LearnerDetailDataResponse })
  @ApiErrorResponse([Errors.ACCOUNT_NOT_FOUND])
  @Roles(UserRole.ACCOUNT)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') learnerId: string) {
    const learner = await this.learnerService.findById(learnerId, ACCOUNT_DETAIL_PROJECTION)
    if (!learner) throw new AppException(Errors.ACCOUNT_NOT_FOUND)

    return learner
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] Deactivate Learner`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Patch('/:id([0-9a-f]{24})/deactivate')
  async deactivate(@Param('id') learnerId: string) {
    await Promise.all([
      this.learnerService.update(
        {
          _id: learnerId
        },
        { status: LearnerStatus.INACTIVE }
      ),
      this.userTokenService.clearAllRefreshTokensOfUser(new Types.ObjectId(learnerId), UserRole.ACCOUNT),
      // update learner report
      this.reportService.update(
        { type: ReportType.LearnerSum, tag: ReportTag.System },
        {
          $inc: {
            [`data.${LearnerStatus.ACTIVE}.quantity`]: -1,
            [`data.${LearnerStatus.INACTIVE}.quantity`]: 1
          }
        }
      )
    ])
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] Activate Learner`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Patch('/:id([0-9a-f]{24})/active')
  async activate(@Param('id') learnerId: string) {
    await this.learnerService.update(
      {
        _id: learnerId
      },
      { status: LearnerStatus.ACTIVE }
    )
    // update learner report
    this.reportService.update(
      { type: ReportType.LearnerSum, tag: ReportTag.System },
      {
        $inc: {
          [`data.${LearnerStatus.ACTIVE}.quantity`]: 1,
          [`data.${LearnerStatus.INACTIVE}.quantity`]: -1
        }
      }
    )
    return new SuccessResponse(true)
  }
}
