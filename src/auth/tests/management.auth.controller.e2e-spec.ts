import { getModelToken } from '@nestjs/mongoose'
import { UserRole } from '@common/contracts/constant'
import { HelperService } from '@common/services/helper.service'
import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { UserToken, UserTokenDocument } from '@auth/schemas/user-token.schema'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Staff, StaffDocument } from '@staff/schemas/staff.schema'

describe('ManagementAuthController (e2e)', () => {
  let staffModel: Model<StaffDocument>
  let userTokenModel: Model<UserTokenDocument>
  let staffLoginTestData = {
    _id: new Types.ObjectId(),
    email: 'staff@gmail.com',
    password: undefined,
    name: 'Orchidfy Staff',
    staffCode: 'STAFF001',
    idCardPhoto: 'idCardPhoto',
    role: UserRole.ACCOUNT
  }
  let userTokenLogoutTestData = {
    userId: new Types.ObjectId(),
    role: UserRole.ACCOUNT,
    refreshToken: 'refreshToken'
  }
  let userTokenRefreshTestData = {
    userId: staffLoginTestData._id,
    role: UserRole.ACCOUNT,
    refreshToken: undefined
  }

  beforeAll(async () => {
    staffModel = global.rootModule.get(getModelToken(Staff.name))
    userTokenModel = global.rootModule.get(getModelToken(UserToken.name))
    const helperService: HelperService = global.rootModule.get(HelperService)
    const jwtService: JwtService = global.rootModule.get(JwtService)
    const configService: ConfigService = global.rootModule.get(ConfigService)

    // Generate password hash
    staffLoginTestData.password = await helperService.hashPassword('aA@123456')

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
    await staffModel.create(staffLoginTestData)

    await userTokenModel.insertMany([userTokenLogoutTestData, userTokenRefreshTestData])
  })

  afterAll(async () => {
    // Clean up test data
    await staffModel.deleteMany({})
    await userTokenModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('POST /auth/management/login', () => {
    it('should return access token and refresh token', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/management/login')
        .send({ role: UserRole.ACCOUNT, email: 'staff@gmail.com', password: 'aA@123456' })
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { accessToken: expect.any(String), refreshToken: expect.any(String) } })
    })
  })

  describe('POST /auth/management/logout', () => {
    it('should be success and disabled sent refresh token ', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/management/logout')
        .send({ refreshToken: userTokenLogoutTestData.refreshToken })
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { success: true } })

      const userToken = await userTokenModel.findOne({ userId: userTokenLogoutTestData.userId })
      expect(userToken.enabled).toBeFalsy()
    })
  })

  describe('POST /auth/management/refresh', () => {
    it('should return new access and refresh token', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/auth/management/refresh')
        .set('Authorization', `Bearer ${userTokenRefreshTestData.refreshToken}`)
        .expect(201)
      expect(status).toEqual(201)
      expect(body).toMatchObject({ data: { accessToken: expect.any(String), refreshToken: expect.any(String) } })
      expect(body.data.refreshToken).not.toEqual(userTokenRefreshTestData.refreshToken)
    })
  })
})
