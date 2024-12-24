import { TestBed, Mocked } from '@suites/unit'
import { AuthService } from '@auth/services/auth.service'
import { ILearnerService } from '@learner/services/learner.service'
import { IInstructorService } from '@instructor/services/instructor.service'
import { IStaffService } from '@staff/services/staff.service'
import { IGardenManagerService } from '@garden-manager/services/garden-manager.service'
import { IUserTokenService } from '@auth/services/user-token.service'
import { IOtpService } from '@auth/services/otp.service'
import { IRecruitmentService } from '@recruitment/services/recruitment.service'
import { JwtService } from '@nestjs/jwt'
import { HelperService } from '@common/services/helper.service'
import { ConfigService } from '@nestjs/config'
import { Errors } from '@common/contracts/error'
import { AppException } from '@common/exceptions/app.exception'
import { SuccessResponse } from '@common/contracts/dto'
import { LoginDto } from '@auth/dto/login.dto'
import { LearnerStatus, RecruitmentStatus, UserRole } from '@common/contracts/constant'
import { Types } from 'mongoose'
import { LearnerRegisterDto, LearnerResendOtpDto, LearnerVerifyAccountDto } from '@auth/dto/learner-register.dto'
import { InstructorRegisterDto } from '@auth/dto/instructor-register.dto'
import { LearnerDocument } from '@learner/schemas/learner.schema'
import { RefreshTokenDto } from '@auth/dto/token.dto'
import { UserToken } from '@auth/schemas/user-token.schema'
import { OtpDocument } from '@auth/schemas/otp.schema'
import { InstructorDocument } from '@instructor/schemas/instructor.schema'
import { RecruitmentDocument } from '@recruitment/schemas/recruitment.schema'
import { ISettingService } from '@setting/services/setting.service'
import { SettingDocument } from '@setting/schemas/setting.schema'
import { INotificationService } from '@notification/services/notification.service'

describe('AuthService', () => {
  let authService: AuthService
  let learnerService: Mocked<ILearnerService>
  let instructorService: Mocked<IInstructorService>
  let staffService: Mocked<IStaffService>
  let gardenManagerService: Mocked<IGardenManagerService>
  let userTokenService: Mocked<IUserTokenService>
  let otpService: Mocked<IOtpService>
  let recruitmentService: Mocked<IRecruitmentService>
  let jwtService: Mocked<JwtService>
  let helperService: Mocked<HelperService>
  let configService: Mocked<ConfigService>
  let notificationService: Mocked<INotificationService>
  let settingService: Mocked<ISettingService>

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AuthService).compile()

    authService = unit
    learnerService = unitRef.get(ILearnerService)
    instructorService = unitRef.get(IInstructorService)
    staffService = unitRef.get(IStaffService)
    gardenManagerService = unitRef.get(IGardenManagerService)
    userTokenService = unitRef.get(IUserTokenService)
    otpService = unitRef.get(IOtpService)
    recruitmentService = unitRef.get(IRecruitmentService)
    jwtService = unitRef.get(JwtService)
    helperService = unitRef.get(HelperService)
    configService = unitRef.get(ConfigService)
    notificationService = unitRef.get(INotificationService)
    settingService = unitRef.get(ISettingService)
  })

  describe('login', () => {
    it('should return a token pair when the credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'valid@email.com',
        password: 'correctPassword'
      }
      const role = UserRole.ACCOUNT

      learnerService.findByEmail.mockResolvedValue({
        _id: '_id',
        email: 'valid@email.com',
        password: 'correctPassword',
        status: LearnerStatus.ACTIVE
      } as LearnerDocument)

      helperService.comparePassword.mockResolvedValue(true)

      const result = await authService.login(loginDto, role)

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
    })

    it('should throw an error when the email or password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'invalid@email.com',
        password: 'incorrectPassword'
      }
      const role = UserRole.ACCOUNT

      learnerService.findByEmail.mockResolvedValue(null)

      await expect(authService.login(loginDto, role)).rejects.toThrow(new AppException(Errors.WRONG_EMAIL_OR_PASSWORD))
    })

    it('should throw an error when the user account is unverified', async () => {
      const loginDto: LoginDto = {
        email: 'unverified@email.com',
        password: 'correctPassword'
      }
      const role = UserRole.ACCOUNT

      learnerService.findByEmail.mockResolvedValue({
        _id: '_id',
        email: 'unverified@email.com',
        password: 'correctPassword',
        status: LearnerStatus.UNVERIFIED
      } as LearnerDocument)

      await expect(authService.login(loginDto, role)).rejects.toThrow(new AppException(Errors.UNVERIFIED_ACCOUNT))
    })

    it('should throw an error when the user account is inactive', async () => {
      const loginDto: LoginDto = {
        email: 'inactive@email.com',
        password: 'correctPassword'
      }
      const role = UserRole.ACCOUNT

      learnerService.findByEmail.mockResolvedValue({
        _id: '_id',
        email: 'inactive@email.com',
        password: 'correctPassword',
        status: LearnerStatus.INACTIVE
      } as LearnerDocument)

      await expect(authService.login(loginDto, role)).rejects.toThrow(new AppException(Errors.INACTIVE_ACCOUNT))
    })

    it('should throw an error when the password does not match', async () => {
      const loginDto: LoginDto = {
        email: 'correct@email.com',
        password: 'incorrectPassword'
      }
      const role = UserRole.ACCOUNT

      learnerService.findByEmail.mockResolvedValue({
        _id: '_id',
        email: 'correct@email.com',
        password: 'correctPassword'
      } as LearnerDocument)

      jest.spyOn(helperService, 'comparePassword').mockResolvedValue(false)

      await expect(authService.login(loginDto, role)).rejects.toThrow(new AppException(Errors.WRONG_EMAIL_OR_PASSWORD))
    })
  })

  describe('logout', () => {
    it('should return a success response when the refresh token is valid', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'valid-refresh-token'
      }

      userTokenService.disableRefreshToken.mockResolvedValue({} as UserToken)

      const result = await authService.logout(refreshTokenDto)

      expect(result).toEqual(new SuccessResponse(true))
    })
  })

  describe('refreshToken', () => {
    it('should return a new token pair when the refresh token is valid', async () => {
      const userId = new Types.ObjectId()
      const role = UserRole.ACCOUNT
      const refreshToken = 'valid-refresh-token'

      userTokenService.findByRefreshToken.mockResolvedValue({
        _id: '_id',
        userId,
        role,
        refreshToken,
        enabled: true
      })

      learnerService.findById.mockResolvedValue({
        _id: userId.toString(),
        name: 'John Doe'
      } as LearnerDocument)

      jwtService.sign.mockReturnValueOnce('new-access-token')
      jwtService.sign.mockReturnValueOnce('new-refresh-token')

      const result = await authService.refreshToken(userId.toString(), role, refreshToken)

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      })

      expect(userTokenService.update).toHaveBeenCalled()
    })

    it('should throw an error when the refresh token is invalid', async () => {
      const userId = new Types.ObjectId()
      const role = UserRole.ACCOUNT
      const refreshToken = 'invalid-refresh-token'

      userTokenService.findByRefreshToken.mockResolvedValue(null)

      await expect(authService.refreshToken(userId.toString(), role, refreshToken)).rejects.toThrow(
        new AppException(Errors.REFRESH_TOKEN_INVALID)
      )
    })

    it('should throw an error when the user does not exist', async () => {
      const userId = new Types.ObjectId()
      const role = UserRole.ACCOUNT
      const refreshToken = 'valid-refresh-token'

      userTokenService.findByRefreshToken.mockResolvedValue({
        _id: '_id',
        userId,
        role,
        refreshToken,
        enabled: true
      })

      learnerService.findById.mockResolvedValue(null)

      await expect(authService.refreshToken(userId.toString(), role, refreshToken)).rejects.toThrow(
        new AppException(Errors.REFRESH_TOKEN_INVALID)
      )
    })
  })

  describe('registerByLearner', () => {
    it('should throw an error when the email already exists', async () => {
      const learnerRegisterDto: LearnerRegisterDto = {
        name: 'John Doe',
        email: 'existing@email.com',
        password: 'password'
      }

      learnerService.findByEmail.mockResolvedValue({
        _id: '_id',
        email: 'existing@email.com'
      } as LearnerDocument)

      await expect(authService.registerByLearner(learnerRegisterDto)).rejects.toThrow(
        new AppException(Errors.EMAIL_ALREADY_EXIST)
      )
    })

    it('should throw an error when OTP creation fails', async () => {
      const learnerRegisterDto: LearnerRegisterDto = {
        name: 'John Doe',
        email: 'valid@email.com',
        password: 'password'
      }

      learnerService.findByEmail.mockResolvedValue(null)
      helperService.hashPassword.mockResolvedValue('hashedPassword')
      helperService.generateRandomString.mockResolvedValue('randomString' as never)
      learnerService.create.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'valid@email.com'
      } as LearnerDocument)
      otpService.create.mockRejectedValue(new Error('OTP creation failed'))

      await expect(authService.registerByLearner(learnerRegisterDto)).rejects.toThrow('OTP creation failed')
    })

    it('should return a success response when registration is successful', async () => {
      const learnerRegisterDto: LearnerRegisterDto = {
        name: 'John Doe',
        email: 'valid@email.com',
        password: 'password'
      }

      learnerService.findByEmail.mockResolvedValue(null)
      helperService.hashPassword.mockResolvedValue('hashedPassword')
      learnerService.create.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'valid@email.com'
      } as LearnerDocument)
      otpService.create.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        code: '123456'
      } as OtpDocument)

      const result = await authService.registerByLearner(learnerRegisterDto)

      expect(result).toEqual(new SuccessResponse(true))
    })
  })

  describe('verifyOtpByLearner', () => {
    it('should throw an error when the learner is not found', async () => {
      const learnerVerifyAccountDto: LearnerVerifyAccountDto = {
        email: 'nonexistent@email.com',
        code: '123456'
      }

      learnerService.findByEmail.mockResolvedValue(null)

      await expect(authService.verifyOtpByLearner(learnerVerifyAccountDto)).rejects.toThrow(
        new AppException(Errors.ACCOUNT_NOT_FOUND)
      )
    })

    it('should throw an error when the learner account is inactive', async () => {
      const learnerVerifyAccountDto: LearnerVerifyAccountDto = {
        email: 'inactive@email.com',
        code: '123456'
      }

      learnerService.findByEmail.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'inactive@email.com',
        status: LearnerStatus.INACTIVE
      } as LearnerDocument)

      await expect(authService.verifyOtpByLearner(learnerVerifyAccountDto)).rejects.toThrow(
        new AppException(Errors.INACTIVE_ACCOUNT)
      )
    })

    it('should throw an error when the OTP is not found or invalid', async () => {
      const learnerVerifyAccountDto: LearnerVerifyAccountDto = {
        email: 'valid@email.com',
        code: 'invalid-code'
      }

      learnerService.findByEmail.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'valid@email.com',
        status: LearnerStatus.UNVERIFIED
      } as LearnerDocument)
      otpService.findByCode.mockResolvedValue(null)

      await expect(authService.verifyOtpByLearner(learnerVerifyAccountDto)).rejects.toThrow(
        new AppException(Errors.WRONG_OTP_CODE)
      )
    })

    it('should throw an error when the OTP is expired', async () => {
      const learnerVerifyAccountDto: LearnerVerifyAccountDto = {
        email: 'valid@email.com',
        code: '123456'
      }

      const userId = new Types.ObjectId()
      learnerService.findByEmail.mockResolvedValue({
        _id: userId.toString(),
        email: 'valid@email.com',
        status: LearnerStatus.UNVERIFIED
      } as LearnerDocument)
      otpService.findByCode.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        userId,
        role: UserRole.ACCOUNT,
        code: '123456',
        expiredAt: new Date(Date.now() - 10000) // 10 seconds ago
      } as OtpDocument)

      await expect(authService.verifyOtpByLearner(learnerVerifyAccountDto)).rejects.toThrow(
        new AppException(Errors.OTP_CODE_IS_EXPIRED)
      )
    })

    it('should return a success response when the OTP is valid', async () => {
      const learnerVerifyAccountDto: LearnerVerifyAccountDto = {
        email: 'valid@email.com',
        code: '123456'
      }

      const userId = new Types.ObjectId()
      learnerService.findByEmail.mockResolvedValue({
        _id: userId.toString(),
        email: 'valid@email.com',
        status: LearnerStatus.UNVERIFIED
      } as LearnerDocument)
      otpService.findByCode.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        userId,
        role: UserRole.ACCOUNT,
        code: '123456',
        expiredAt: new Date(Date.now() + 10000) // 10 seconds later
      } as OtpDocument)

      const result = await authService.verifyOtpByLearner(learnerVerifyAccountDto)

      expect(result).toEqual(new SuccessResponse(true))
    })
  })

  describe('resendOtpByLearner', () => {
    it('should throw an error when the learner is not found', async () => {
      const learnerResendOtpDto: LearnerResendOtpDto = {
        email: 'nonexistent@email.com'
      }

      learnerService.findByEmail.mockResolvedValue(null)

      await expect(authService.resendOtpByLearner(learnerResendOtpDto)).rejects.toThrow(
        new AppException(Errors.ACCOUNT_NOT_FOUND)
      )
    })

    it('should throw an error when the learner account is inactive', async () => {
      const learnerResendOtpDto: LearnerResendOtpDto = {
        email: 'inactive@email.com'
      }

      learnerService.findByEmail.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'inactive@email.com',
        status: LearnerStatus.INACTIVE
      } as LearnerDocument)

      await expect(authService.resendOtpByLearner(learnerResendOtpDto)).rejects.toThrow(
        new AppException(Errors.INACTIVE_ACCOUNT)
      )
    })

    it('should throw an error when the OTP resend limit is reached', async () => {
      const learnerResendOtpDto: LearnerResendOtpDto = {
        email: 'valid@email.com'
      }

      learnerService.findByEmail.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'valid@email.com',
        status: LearnerStatus.UNVERIFIED
      } as LearnerDocument)
      settingService.findByKey.mockResolvedValue({ value: 5 } as SettingDocument)
      otpService.findByUserIdAndRole.mockResolvedValue({
        __v: 5
        // updatedAt: new Date(Date.now() - 10000) // 10 seconds ago
      } as OtpDocument)

      await expect(authService.resendOtpByLearner(learnerResendOtpDto)).rejects.toThrow(
        new AppException(Errors.RESEND_OTP_CODE_LIMITED)
      )
    })

    it('should return a success response when the OTP is resent successfully', async () => {
      const learnerResendOtpDto: LearnerResendOtpDto = {
        email: 'valid@email.com'
      }

      learnerService.findByEmail.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'valid@email.com',
        status: LearnerStatus.UNVERIFIED
      } as LearnerDocument)
      otpService.findByUserIdAndRole.mockResolvedValue({
        __v: 4,
        save: () => {}
        // updatedAt: new Date(Date.now() - 10000) // 10 seconds ago
      } as OtpDocument)
      settingService.findByKey.mockResolvedValue({ value: 5 } as SettingDocument)

      const result = await authService.resendOtpByLearner(learnerResendOtpDto)

      expect(result).toEqual(new SuccessResponse(true))
    })
  })

  describe('registerByInstructor', () => {
    it('should throw an error when the email already exists', async () => {
      const instructorRegisterDto: InstructorRegisterDto = {
        name: 'John Doe',
        email: 'existing@email.com',
        phone: '1234567890',
        cv: 'cv',
        note: 'note'
      }

      instructorService.findByEmail.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'existing@email.com'
      } as InstructorDocument)

      await expect(authService.registerByInstructor(instructorRegisterDto)).rejects.toThrow(
        new AppException(Errors.EMAIL_ALREADY_EXIST)
      )
    })

    it('should throw an error when the instructor has in-progressing applications', async () => {
      const instructorRegisterDto: InstructorRegisterDto = {
        name: 'John Doe',
        email: 'valid@email.com',
        phone: '1234567890',
        cv: 'cv',
        note: 'note'
      }

      instructorService.findByEmail.mockResolvedValue(null)
      recruitmentService.findOneByApplicationEmailAndStatus.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        applicationInfo: instructorRegisterDto,
        status: RecruitmentStatus.PENDING
      } as RecruitmentDocument)

      await expect(authService.registerByInstructor(instructorRegisterDto)).rejects.toThrow(
        new AppException(Errors.ACCOUNT_HAS_IN_PROGRESSING_APPLICATIONS)
      )
    })

    it('should throw an error when recruitment creation fails', async () => {
      const instructorRegisterDto: InstructorRegisterDto = {
        name: 'John Doe',
        email: 'valid@email.com',
        phone: '1234567890',
        cv: 'cv',
        note: 'note'
      }

      instructorService.findByEmail.mockResolvedValue(null)
      recruitmentService.findOneByApplicationEmailAndStatus.mockResolvedValue(null)
      recruitmentService.create.mockRejectedValue(new Error('Recruitment creation failed'))

      await expect(authService.registerByInstructor(instructorRegisterDto)).rejects.toThrow(
        'Recruitment creation failed'
      )
    })

    it('should return a success response when registration is successful', async () => {
      const instructorRegisterDto: InstructorRegisterDto = {
        name: 'John Doe',
        email: 'valid@email.com',
        phone: '1234567890',
        cv: 'cv',
        note: 'note'
      }

      instructorService.findByEmail.mockResolvedValue(null)
      recruitmentService.findOneByApplicationEmailAndStatus.mockResolvedValue(null)
      recruitmentService.create.mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        applicationInfo: instructorRegisterDto,
        status: RecruitmentStatus.PENDING
      } as RecruitmentDocument)

      const result = await authService.registerByInstructor(instructorRegisterDto)

      expect(result).toEqual(new SuccessResponse(true))
    })
  })
})
