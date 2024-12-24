import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { ISettingService } from '@setting/services/setting.service'
import { CourseTypesSettingDetailDataResponse, QuerySettingDto, SettingDetailDataResponse } from '@setting/dto/view-setting.dto'
import { SettingKey } from '@setting/contracts/constant'
import { AppException } from '@common/exceptions/app.exception'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'

@ApiTags('Setting')
@ApiBadRequestResponse({ type: ErrorResponse })
@Controller()
export class SettingController {
  constructor(
    @Inject(ISettingService)
    private readonly settingService: ISettingService
  ) {}

  @ApiOperation({
    summary: `View Setting Value By Key`
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: SettingDetailDataResponse })
  @UseGuards(JwtAuthGuard.ACCESS_TOKEN)
  @Get()
  async getByKey(@Query() querySettingDto: QuerySettingDto) {
    return await this.settingService.findByKey(querySettingDto.key)
  }

  @ApiOperation({
    summary: `View Course Types (Setting Detail)`
  })
  @ApiOkResponse({ type: CourseTypesSettingDetailDataResponse })
  @ApiErrorResponse([Errors.SETTING_NOT_FOUND])
  @Get('course-types')
  async getCourseTypesSetting() {
    const setting = await this.settingService.findByKey(SettingKey.CourseTypes)
    if (!setting || setting.enabled === false) throw new AppException(Errors.SETTING_NOT_FOUND)
    return { docs: setting.value }
  }
}
