import { getModelToken } from '@nestjs/mongoose'
import { RecruitmentStatus, UserRole } from '@common/contracts/constant'
import { HelperService } from '@common/services/helper.service'
import { Instructor, InstructorDocument } from '@instructor/schemas/instructor.schema'
import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { UserToken, UserTokenDocument } from '@auth/schemas/user-token.schema'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Recruitment, RecruitmentDocument } from '@recruitment/schemas/recruitment.schema'

describe('InstructorAuthController (e2e)', () => {
  let instructorModel: Model<InstructorDocument>
  let userTokenModel: Model<UserTokenDocument>
  let recruitmentModel: Model<RecruitmentDocument>
  let instructorLoginTestData = {
    _id: new Types.ObjectId(),
    email: 'instructor@gmail.com',
    password: undefined,
    name: 'Orchidfy Instructor',
    idCardPhoto: 'idCardPhoto',
    dateOfBirth: '2000-12-12T00:00:00.000Z',
    phone: '0987654321'
  }
  let userTokenLogoutTestData = {
    userId: new Types.ObjectId(),
    role: UserRole.ACCOUNT,
    refreshToken: 'refreshToken'
  }
  let userTokenRefreshTestData = {
    userId: instructorLoginTestData._id,
    role: UserRole.ACCOUNT,
    refreshToken: undefined
  }

  beforeAll(async () => {
    instructorModel = global.rootModule.get(getModelToken(Instructor.name))
    userTokenModel = global.rootModule.get(getModelToken(UserToken.name))
    recruitmentModel = global.rootModule.get(getModelToken(Recruitment.name))
    const helperService: HelperService = global.rootModule.get(HelperService)
    const jwtService: JwtService = global.rootModule.get(JwtService)
    const configService: ConfigService = global.rootModule.get(ConfigService)

    // Generate password hash
    instructorLoginTestData.password = await helperService.hashPassword('aA@123456')

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
    await instructorModel.create(instructorLoginTestData)

    await userTokenModel.insertMany([userTokenLogoutTestData, userTokenRefreshTestData])
  })

  afterAll(async () => {
    // Clean up test data
    await instructorModel.deleteMany({})
    await userTokenModel.deleteMany({})
    await recruitmentModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('POST /auth/instructor/login', () => {
    it('should return access token and refresh token', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/instructor/login')
        .send({ email: 'instructor@gmail.com', password: 'aA@123456' })
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { accessToken: expect.any(String), refreshToken: expect.any(String) } })
    })
  })

  describe('POST /auth/instructor/logout', () => {
    it('should be success and disabled sent refresh token ', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/instructor/logout')
        .send({ refreshToken: userTokenLogoutTestData.refreshToken })
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { success: true } })

      const userToken = await userTokenModel.findOne({ userId: userTokenLogoutTestData.userId })
      expect(userToken.enabled).toBeFalsy()
    })
  })

  describe('POST /auth/instructor/refresh', () => {
    it('should return new access and refresh token', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/instructor/refresh')
        .set('Authorization', `Bearer ${userTokenRefreshTestData.refreshToken}`)
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { accessToken: expect.any(String), refreshToken: expect.any(String) } })
      expect(body.data.refreshToken).not.toEqual(userTokenRefreshTestData.refreshToken)
    })
  })

  describe('POST /auth/instructor/register', () => {
    it('should be success and create an instructor recruitment with PENDING status', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/instructor/register')
        .send({
          email: 'new-instructor@gmail.com',
          name: 'New Orchidfy Instructor',
          phone: '0987654321',
          cv: 'https://cv.com'
        })
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { success: true } })

      const recruitment = await recruitmentModel.findOne({
        'applicationInfo.email': 'new-instructor@gmail.com',
        status: RecruitmentStatus.PENDING
      })
      expect(recruitment).toBeTruthy()
    })
  })
})
