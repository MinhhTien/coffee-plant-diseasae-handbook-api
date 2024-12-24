import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { IAuthService } from '@auth/services/auth.service'
import { LoginDto } from '@auth/dto/login.dto'
import { ErrorResponse, SuccessDataResponse } from '@common/contracts/dto'
import { RefreshTokenDto, TokenDataResponse } from '@auth/dto/token.dto'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { InstructorRegisterDto } from '@auth/dto/instructor-register.dto'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Errors } from '@common/contracts/error'

@ApiTags('Auth - Instructor')
@Controller('instructor')
@ApiBadRequestResponse({ type: ErrorResponse })
export class InstructorAuthController {
  constructor(
    @Inject(IAuthService)
    private readonly authService: IAuthService
  ) {}

  @Post('login')
  @ApiCreatedResponse({ type: TokenDataResponse })
  @ApiErrorResponse([Errors.WRONG_EMAIL_OR_PASSWORD, Errors.INACTIVE_ACCOUNT])
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, UserRole.ACCOUNT)
  }

  @Post('logout')
  @ApiCreatedResponse({ type: SuccessDataResponse })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.logout(refreshTokenDto)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard.REFRESH_TOKEN)
  @Post('refresh')
  @ApiCreatedResponse({ type: TokenDataResponse })
  @ApiErrorResponse([Errors.REFRESH_TOKEN_INVALID])
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user?._id, req.user?.role, req.user?.refreshToken)
  }
}
