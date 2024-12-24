import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { IAuthService } from '@auth/services/auth.service'
import { LoginDto } from '@auth/dto/login.dto'
import { ErrorResponse, SuccessDataResponse } from '@common/contracts/dto'
import { RefreshTokenDto, TokenDataResponse } from '@auth/dto/token.dto'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { LearnerRegisterDto, LearnerResendOtpDto, LearnerVerifyAccountDto } from '@auth/dto/learner-register.dto'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'

@ApiTags('Auth - Learner')
@Controller('learner')
@ApiBadRequestResponse({ type: ErrorResponse })
export class LearnerAuthController {
  constructor(
    @Inject(IAuthService)
    private readonly authService: IAuthService
  ) {}

  @Post('login')
  @ApiCreatedResponse({ type: TokenDataResponse })
  @ApiErrorResponse([Errors.WRONG_EMAIL_OR_PASSWORD, Errors.INACTIVE_ACCOUNT, Errors.UNVERIFIED_ACCOUNT])
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

  @Post('register')
  @ApiCreatedResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.EMAIL_ALREADY_EXIST])
  async register(@Body() LearnerRegisterDto: LearnerRegisterDto) {
    return await this.authService.registerByLearner(LearnerRegisterDto)
  }

  @Post('verify-otp')
  @ApiCreatedResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([
    Errors.ACCOUNT_NOT_FOUND,
    Errors.INACTIVE_ACCOUNT,
    Errors.WRONG_OTP_CODE,
    Errors.OTP_CODE_IS_EXPIRED
  ])
  verifyOtp(@Body() LearnerVerifyAccountDto: LearnerVerifyAccountDto) {
    return this.authService.verifyOtpByLearner(LearnerVerifyAccountDto)
  }

  @Post('resend-otp')
  @ApiCreatedResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.ACCOUNT_NOT_FOUND, Errors.INACTIVE_ACCOUNT, Errors.RESEND_OTP_CODE_LIMITED])
  resendOtp(@Body() learnerResendOtpDto: LearnerResendOtpDto) {
    return this.authService.resendOtpByLearner(learnerResendOtpDto)
  }
}
