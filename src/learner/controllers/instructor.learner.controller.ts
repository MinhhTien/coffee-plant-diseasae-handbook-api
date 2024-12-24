import { Controller, Get, UseGuards, Inject, Param } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { ILearnerService } from '@learner/services/learner.service'
import { LearnerDetailDataResponse } from '@learner/dto/view-learner.dto'
import { ACCOUNT_DETAIL_PROJECTION } from '@learner/contracts/constant'

@ApiTags('Learner - Instructor')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.ACCOUNT)
@Controller('instructor')
export class InstructorLearnerController {
  constructor(
    @Inject(ILearnerService)
    private readonly learnerService: ILearnerService
  ) {}

  @ApiOperation({
    summary: `View Learner Detail`
  })
  @ApiOkResponse({ type: LearnerDetailDataResponse })
  @ApiErrorResponse([Errors.ACCOUNT_NOT_FOUND])
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') learnerId: string) {
    const learner = await this.learnerService.findById(learnerId, ACCOUNT_DETAIL_PROJECTION)
    if (!learner) throw new AppException(Errors.ACCOUNT_NOT_FOUND)

    return learner
  }
}
