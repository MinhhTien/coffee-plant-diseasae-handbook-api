import { UserToken, UserTokenDocument } from '@auth/schemas/user-token.schema'
import { LearnerStatus, UserRole } from '@common/contracts/constant'
import { HelperService } from '@common/services/helper.service'
import { Learner, LearnerDocument } from '@learner/schemas/learner.schema'
import * as request from 'supertest'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Otp, OtpDocument } from '@auth/schemas/otp.schema'

describe('LearnerAuthController (e2e)', () => {
  let learnerModel: Model<LearnerDocument>
  let userTokenModel: Model<UserTokenDocument>
  let otpModel: Model<OtpDocument>
  let learnerLoginTestData = {
    _id: new Types.ObjectId(),
    email: 'learner@gmail.com',
    password: undefined,
    name: 'Orchidfy Learner',
    status: LearnerStatus.ACTIVE
  }
  let userTokenLogoutTestData = {
    userId: new Types.ObjectId(),
    role: UserRole.ACCOUNT,
    refreshToken: 'refreshToken'
  }
  let userTokenRefreshTestData = {
    userId: learnerLoginTestData._id,
    role: UserRole.ACCOUNT,
    refreshToken: undefined
  }
  let learnerOtpVerifyTestData = {
    _id: new Types.ObjectId(),
    email: 'learner-otp-verify@gmail.com',
    password: undefined,
    name: 'OTP Verify Orchidfy Learner'
  }
  let otpVerifyTestData = {
    _id: new Types.ObjectId(),
    code: '123456',
    userId: learnerOtpVerifyTestData._id,
    role: UserRole.ACCOUNT,
    expiredAt: new Date(Date.now() + 5 * 60000)
  }
  let learnerOtpResendTestData = {
    _id: new Types.ObjectId(),
    email: 'learner-otp-resend@gmail.com',
    password: undefined,
    name: 'OTP Resend Orchidfy Learner'
  }
  let otpResendTestData = {
    _id: new Types.ObjectId(),
    code: '654321',
    userId: learnerOtpResendTestData._id,
    role: UserRole.ACCOUNT,
    expiredAt: new Date(Date.now() + 5 * 60000)
  }

  beforeAll(async () => {
    learnerModel = global.rootModule.get(getModelToken(Learner.name))
    userTokenModel = global.rootModule.get(getModelToken(UserToken.name))
    otpModel = global.rootModule.get(getModelToken(Otp.name))
    const helperService: HelperService = global.rootModule.get(HelperService)
    const jwtService: JwtService = global.rootModule.get(JwtService)
    const configService: ConfigService = global.rootModule.get(ConfigService)

    // Generate password hash
    learnerLoginTestData.password = await helperService.hashPassword('aA@123456')
    learnerOtpVerifyTestData.password = await helperService.hashPassword('aA@123456')
    learnerOtpResendTestData.password = await helperService.hashPassword('aA@123456')

    // Generate valid refresh token
    userTokenRefreshTestData.refreshToken = jwtService.sign(
      {
        sub: userTokenRefreshTestData.userId,
        role: UserRole.ACCOUNT
      },
      {
        secret: configService.get('JWT_REFRESH_SECRET')
      }
    )

    // Insert test data
    await learnerModel.insertMany([learnerLoginTestData, learnerOtpVerifyTestData, learnerOtpResendTestData])

    await userTokenModel.insertMany([userTokenLogoutTestData, userTokenRefreshTestData])

    await otpModel.insertMany([otpVerifyTestData, otpResendTestData])
  })

  afterAll(async () => {
    // Clean up test data
    await learnerModel.deleteMany({})
    await userTokenModel.deleteMany({})
    await otpModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('POST /auth/learner/login', () => {
    it('should return access token and refresh token', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/learner/login')
        .send({ email: 'learner@gmail.com', password: 'aA@123456' })
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { accessToken: expect.any(String), refreshToken: expect.any(String) } })
    })
  })

  describe('POST /auth/learner/logout', () => {
    it('should be success and disabled sent refresh token ', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/learner/logout')
        .send({ refreshToken: userTokenLogoutTestData.refreshToken })
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { success: true } })

      const userToken = await userTokenModel.findOne({ userId: userTokenLogoutTestData.userId })
      expect(userToken.enabled).toBeFalsy()
    })
  })

  describe('POST /auth/learner/refresh', () => {
    it('should return new access and refresh token', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/learner/refresh')
        .set('Authorization', `Bearer ${userTokenRefreshTestData.refreshToken}`)
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { accessToken: expect.any(String), refreshToken: expect.any(String) } })
      expect(body.data.refreshToken).not.toEqual(userTokenRefreshTestData.refreshToken)
    })
  })

  describe('POST /auth/learner/register', () => {
    it('should be success, create a learner with UNVERIFIED status and a OTP code', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/learner/register')
        .send({ email: 'new-learner@gmail.com', password: 'aA@123456', name: 'New Handbook Learner' })
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { success: true } })

      const learner = await learnerModel.findOne({ email: 'new-learner@gmail.com' })
      expect(learner).toBeTruthy()
      expect(learner.status).toEqual('UNVERIFIED')
      const otp = await otpModel.findOne({ userId: learner._id })
      expect(otp).toBeTruthy()
    })
  })

  describe('POST /auth/learner/verify-otp', () => {
    it('should be success, update learner status to ACTIVE and remove OTP code', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/learner/verify-otp')
        .send({ email: learnerOtpVerifyTestData.email, code: otpVerifyTestData.code })
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { success: true } })

      const learner = await learnerModel.findOne({ email: learnerOtpVerifyTestData.email })
      expect(learner).toBeTruthy()
      expect(learner.status).toEqual('ACTIVE')
      const otp = await otpModel.findOne({ userId: learnerOtpVerifyTestData._id })
      expect(otp).toBeFalsy()
    })
  })

  describe('POST /auth/learner/resend-otp', () => {
    it('should be success and update OTP code', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/learner/resend-otp')
        .send({ email: learnerOtpResendTestData.email })
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { success: true } })

      const otp = await otpModel.findOne({ userId: learnerOtpResendTestData._id })
      expect(otp).toBeTruthy()
      expect(otp.code).not.toEqual(otpResendTestData.code)
    })
  })
})
