import { Controller, Get, Req, UseGuards, Inject, Put, Body } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ILearnerService } from '@src/learner/services/learner.service'
import { ErrorResponse, SuccessDataResponse, SuccessResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { LearnerProfileDataResponse } from '@learner/dto/view-learner.dto'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { ACCOUNT_PROFILE_PROJECTION } from '@learner/contracts/constant'
import { UpdateLearnerProfileDto } from '@learner/dto/update-learner-profile.dto'

@ApiTags('Learner')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@Roles(UserRole.ACCOUNT)
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller()
export class LearnerController {
  constructor(
    @Inject(ILearnerService)
    private readonly learnerService: ILearnerService
  ) {}

  @ApiOperation({
    summary: 'View learner profile'
  })
  @Get('profile')
  @ApiOkResponse({ type: LearnerProfileDataResponse })
  @ApiErrorResponse([Errors.ACCOUNT_NOT_FOUND])
  async viewProfile(@Req() req) {
    const { _id } = _.get(req, 'user')
    const learner = await this.learnerService.findById(_id, ACCOUNT_PROFILE_PROJECTION)

    if (!learner) throw new AppException(Errors.ACCOUNT_NOT_FOUND)
    return learner
  }

  @ApiOperation({
    summary: 'Update learner profile'
  })
  @Put('profile')
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.ACCOUNT_NOT_FOUND])
  async updateProfile(@Req() req, @Body() updateLearnerProfileDto: UpdateLearnerProfileDto) {
    const { _id } = _.get(req, 'user')
    const learner = await this.learnerService.update({ _id }, updateLearnerProfileDto)

    if (!learner) throw new AppException(Errors.ACCOUNT_NOT_FOUND)
    return new SuccessResponse(true)
  }
}
