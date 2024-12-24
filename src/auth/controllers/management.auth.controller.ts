import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { IAuthService } from '@auth/services/auth.service'
import { LoginDto, ManagementLoginDto } from '@auth/dto/login.dto'
import { ErrorResponse, SuccessDataResponse } from '@common/contracts/dto'
import { RefreshTokenDto, TokenDataResponse } from '@auth/dto/token.dto'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'

@ApiTags('Auth - Management')
@Controller('management')
@ApiBadRequestResponse({ type: ErrorResponse })
export class ManagementAuthController {
  constructor(
    @Inject(IAuthService)
    private readonly authService: IAuthService
  ) {}

  @Post('login')
  @ApiOperation({
    summary: `role: ${UserRole.ACCOUNT}, ${UserRole.ACCOUNT}, ${UserRole.ACCOUNT}`
  })
  @ApiCreatedResponse({ type: TokenDataResponse })
  @ApiErrorResponse([Errors.WRONG_EMAIL_OR_PASSWORD, Errors.INACTIVE_ACCOUNT])
  login(@Body() loginDto: ManagementLoginDto) {
    return this.authService.login(loginDto, loginDto.role)
  }

  @Post('logout')
  @ApiOperation({
    summary: `role: ${UserRole.ACCOUNT}, ${UserRole.ACCOUNT}, ${UserRole.ACCOUNT}`
  })
  @ApiCreatedResponse({ type: SuccessDataResponse })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.logout(refreshTokenDto)
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard.REFRESH_TOKEN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `role: ${UserRole.ACCOUNT}, ${UserRole.ACCOUNT}, ${UserRole.ACCOUNT}`
  })
  @ApiCreatedResponse({ type: TokenDataResponse })
  @ApiErrorResponse([Errors.REFRESH_TOKEN_INVALID])
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user?._id, req.user?.role, req.user?.refreshToken)
  }
}
