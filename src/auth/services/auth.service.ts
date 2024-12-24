import { JwtService } from '@nestjs/jwt'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import * as moment from 'moment'
import { Errors } from '@common/contracts/error'
import {
  UserRole,
  LearnerStatus,
  InstructorStatus,
  StaffStatus,
  GardenManagerStatus,
  RecruitmentStatus
} from '@common/contracts/constant'
import { AccessTokenPayload } from '@auth/strategies/jwt-access.strategy'
import { RefreshTokenPayload } from '@auth/strategies/jwt-refresh.strategy'
import { RefreshTokenDto, TokenResponse } from '@auth/dto/token.dto'
import { ConfigService } from '@nestjs/config'
import { SuccessResponse } from '@common/contracts/dto'
import { ILearnerService } from '@learner/services/learner.service'
import { AppException } from '@common/exceptions/app.exception'
import { LoginDto } from '@auth/dto/login.dto'
import { IUserTokenService } from './user-token.service'
import { LearnerRegisterDto, LearnerResendOtpDto, LearnerVerifyAccountDto } from '@auth/dto/learner-register.dto'
import { HelperService } from '@common/services/helper.service'
import { IOtpService } from './otp.service'
import { Types } from 'mongoose'
import { InstructorRegisterDto } from '@auth/dto/instructor-register.dto'
import { ISettingService } from '@setting/services/setting.service'
import { SettingKey } from '@setting/contracts/constant'
import { INotificationService } from '@notification/services/notification.service'
import { IReportService } from '@report/services/report.service'
import { ReportTag, ReportType } from '@report/contracts/constant'

export interface IAuthUserService {
  findByEmail(email: string, projection?: string | Record<string, any>)
  findById(id: string): Promise<any>
}

export const IAuthService = Symbol('IAuthService')

export interface IAuthService {
  login(loginDto: LoginDto, role: UserRole): Promise<TokenResponse>
  logout(refreshTokenDto: RefreshTokenDto): Promise<SuccessResponse>
  refreshToken(id: string, role: UserRole, refreshToken: string): Promise<TokenResponse>

  registerByLearner(learnerRegisterDto: LearnerRegisterDto): Promise<SuccessResponse>
  verifyOtpByLearner(learnerVerifyAccountDto: LearnerVerifyAccountDto): Promise<SuccessResponse>
  resendOtpByLearner(learnerResendOtpDto: LearnerResendOtpDto): Promise<SuccessResponse>
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(ILearnerService)
    private readonly learnerService: ILearnerService,
    @Inject(IUserTokenService)
    private readonly userTokenService: IUserTokenService,
    @Inject(IOtpService)
    private readonly otpService: IOtpService,
    @Inject(ISettingService)
    private readonly settingService: ISettingService,
    private readonly jwtService: JwtService,
    private readonly helperService: HelperService,
    private readonly configService: ConfigService,
    @Inject(INotificationService)
    private readonly notificationService: INotificationService,
    @Inject(IReportService)
    private readonly reportService: IReportService
  ) {}

  private readonly authUserServiceMap: Record<UserRole, IAuthUserService> = {
    [UserRole.ACCOUNT]: this.learnerService
  }

  public async login(loginDto: LoginDto, role: UserRole): Promise<TokenResponse> {
    const user = await this.authUserServiceMap[role].findByEmail(loginDto.email, '+password')
    if (!user) throw new AppException(Errors.WRONG_EMAIL_OR_PASSWORD)
    if (user.status === LearnerStatus.UNVERIFIED) throw new AppException(Errors.UNVERIFIED_ACCOUNT)
    if (
      [LearnerStatus.INACTIVE, InstructorStatus.INACTIVE, StaffStatus.INACTIVE, GardenManagerStatus.INACTIVE].includes(
        user.status
      )
    )
      throw new AppException(Errors.INACTIVE_ACCOUNT)

    const isPasswordMatch = await this.helperService.comparePassword(loginDto.password, user.password)
    if (!isPasswordMatch) throw new BadRequestException(Errors.WRONG_EMAIL_OR_PASSWORD.message)

    const userRole = user.role ?? role
    const accessTokenPayload: AccessTokenPayload = { sub: user._id, role: userRole, name: user.name }
    const refreshTokenPayload: RefreshTokenPayload = { sub: user._id, role: userRole }

    const tokens = this.generateTokens(accessTokenPayload, refreshTokenPayload)

    await this.userTokenService.create({ userId: user._id, role: userRole, refreshToken: tokens.refreshToken })
    return tokens
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    await this.userTokenService.disableRefreshToken(refreshTokenDto.refreshToken)
    return new SuccessResponse(true)
  }

  public async refreshToken(id: string, role: UserRole, refreshToken: string): Promise<TokenResponse> {
    const userToken = await this.userTokenService.findByRefreshToken(refreshToken)
    if (!userToken || userToken.enabled === false) throw new AppException(Errors.REFRESH_TOKEN_INVALID)

    const user = await this.authUserServiceMap[role].findById(id)
    if (!user) throw new AppException(Errors.REFRESH_TOKEN_INVALID)

    const accessTokenPayload: AccessTokenPayload = { sub: user._id, role, name: user.name }
    const refreshTokenPayload: RefreshTokenPayload = { sub: user._id, role }
    const tokens = this.generateTokens(accessTokenPayload, refreshTokenPayload)

    await this.userTokenService.update({ _id: userToken._id }, { refreshToken: tokens.refreshToken })
    return tokens
  }

  async registerByLearner(learnerRegisterDto: LearnerRegisterDto): Promise<SuccessResponse> {
    const existedLearner = await this.learnerService.findByEmail(learnerRegisterDto.email)
    if (existedLearner) throw new AppException(Errors.EMAIL_ALREADY_EXIST)

    const password = await this.helperService.hashPassword(learnerRegisterDto.password)

    const learner = await this.learnerService.create({
      name: learnerRegisterDto.name,
      email: learnerRegisterDto.email,
      // dateOfBirth: learnerRegisterDto.dateOfBirth,
      // phone: learnerRegisterDto.phone,
      status: LearnerStatus.UNVERIFIED,
      password
    })

    const code = this.helperService.generateRandomString(6)
    await this.otpService.create({
      code,
      userId: new Types.ObjectId(learner._id),
      role: UserRole.ACCOUNT,
      expiredAt: new Date(Date.now() + 5 * 60000)
    })

    this.notificationService.sendMail({
      to: learner.email,
      subject: `[Handbook] Account Verification`,
      template: 'learner/verify-account',
      context: {
        code,
        name: learner.name,
        expirationMinutes: 5
      }
    })

    // update learner report
    this.updateReportWhenLearnerRegistered()

    return new SuccessResponse(true)
  }

  public async verifyOtpByLearner(learnerVerifyAccountDto: LearnerVerifyAccountDto): Promise<SuccessResponse> {
    const learner = await this.learnerService.findByEmail(learnerVerifyAccountDto.email)
    if (!learner) throw new AppException(Errors.ACCOUNT_NOT_FOUND)
    if (learner.status === LearnerStatus.INACTIVE) throw new AppException(Errors.INACTIVE_ACCOUNT)
    if (learner.status === LearnerStatus.ACTIVE) return new SuccessResponse(true)

    const otp = await this.otpService.findByCode(learnerVerifyAccountDto.code)
    if (!otp || otp.userId?.toString() !== learner._id?.toString() || otp.role !== UserRole.ACCOUNT)
      throw new AppException(Errors.WRONG_OTP_CODE)
    if (otp.expiredAt < new Date()) throw new AppException(Errors.OTP_CODE_IS_EXPIRED)

    await Promise.all([
      this.learnerService.update({ _id: learner._id }, { status: LearnerStatus.ACTIVE }),
      this.otpService.clearOtp(learnerVerifyAccountDto.code),
      this.updateReportWhenLearnerVerified()
    ])

    return new SuccessResponse(true)
  }

  async resendOtpByLearner(learnerResendOtpDto: LearnerResendOtpDto): Promise<SuccessResponse> {
    const learner = await this.learnerService.findByEmail(learnerResendOtpDto.email)
    if (!learner) throw new AppException(Errors.ACCOUNT_NOT_FOUND)
    if (learner.status === LearnerStatus.INACTIVE) throw new AppException(Errors.INACTIVE_ACCOUNT)
    if (learner.status === LearnerStatus.ACTIVE) return new SuccessResponse(true)

    const resendOtpCodeLimit = Number((await this.settingService.findByKey(SettingKey.ResendOtpCodeLimit))?.value) || 5
    const otp = await this.otpService.findByUserIdAndRole(learner._id, UserRole.ACCOUNT)
    if (otp.__v >= resendOtpCodeLimit && moment(otp['updatedAt']).isSame(new Date(), 'day'))
      throw new AppException(Errors.RESEND_OTP_CODE_LIMITED)

    const code = this.helperService.generateRandomString(6)
    otp.code = code
    otp.expiredAt = new Date(Date.now() + 5 * 60000)
    otp.__v++
    await otp.save()

    // Send email contain OTP to learner
    this.notificationService.sendMail({
      to: learner.email,
      subject: `[Handbook] Resend Account Verification`,
      template: 'learner/verify-account',
      context: {
        code,
        name: learner.name,
        expirationMinutes: 5
      }
    })

    return new SuccessResponse(true)
  }
  // =============================================================== //
  //                         Private method
  // =============================================================== //

  private generateTokens(accessTokenPayload: AccessTokenPayload, refreshTokenPayload: RefreshTokenPayload) {
    return {
      accessToken: this.jwtService.sign(accessTokenPayload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION')
      }),
      refreshToken: this.jwtService.sign(refreshTokenPayload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION')
      })
    }
  }

  private updateReportWhenLearnerRegistered() {
    // update learner report
    this.reportService.update(
      { type: ReportType.LearnerSum, tag: ReportTag.System },
      {
        $inc: {
          'data.quantity': 1,
          [`data.${LearnerStatus.UNVERIFIED}.quantity`]: 1
        }
      }
    )

    // update learner sum by month report
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    this.reportService.update(
      { type: ReportType.LearnerSumByMonth, tag: ReportTag.System, 'data.year': year },
      {
        $inc: {
          [`data.${month}.quantity`]: 1
        }
      }
    )
  }

  private updateReportWhenLearnerVerified() {
    // update learner report
    this.reportService.update(
      { type: ReportType.LearnerSum, tag: ReportTag.System },
      {
        $inc: {
          [`data.${LearnerStatus.UNVERIFIED}.quantity`]: -1,
          [`data.${LearnerStatus.ACTIVE}.quantity`]: 1
        }
      }
    )
  }

  private updateReportWhenInstructorRegistered() {
    // update recruitment report
    this.reportService.update(
      { type: ReportType.RecruitmentApplicationSum, tag: ReportTag.System },
      {
        $inc: {
          'data.quantity': 1
        }
      }
    )
  }
}
