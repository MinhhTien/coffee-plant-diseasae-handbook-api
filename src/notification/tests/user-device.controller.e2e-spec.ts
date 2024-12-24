import * as request from 'supertest'
import { Types } from 'mongoose'
import { UserRole, UserDeviceStatus } from '@common/contracts/constant'
import { UserDevice } from '@notification/schemas/user-device.schema'
import { getModelToken } from '@nestjs/mongoose'
import { IFirebaseMessagingService } from '@firebase/services/firebase.messaging.service'
import { IUserDeviceService } from '@notification/services/user-device.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { MessagingTopicManagementResponse } from 'firebase-admin/lib/messaging/messaging-api'

describe('UserDeviceController (e2e)', () => {
  let userDeviceModel
  let firebaseMessagingService: IFirebaseMessagingService
  let userDeviceService: IUserDeviceService
  let jwtService: JwtService
  let configService: ConfigService
  const mockUserId = new Types.ObjectId()
  const mockFcmToken = 'mock-fcm-token-123'
  let accessToken: string

  const testUserDevice = {
    userId: mockUserId,
    userRole: UserRole.ACCOUNT,
    fcmToken: mockFcmToken,
    browser: 'Chrome',
    os: 'Windows',
    status: UserDeviceStatus.ACTIVE
  }

  beforeAll(async () => {
    userDeviceModel = global.rootModule.get(getModelToken(UserDevice.name))
    firebaseMessagingService = global.rootModule.get(IFirebaseMessagingService)
    userDeviceService = global.rootModule.get(IUserDeviceService)
    jwtService = global.rootModule.get(JwtService)
    configService = global.rootModule.get(ConfigService)

    // Create valid access token
    accessToken = jwtService.sign(
      {
        sub: mockUserId.toString(),
        role: UserRole.ACCOUNT
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test data
    await userDeviceModel.create(testUserDevice)

    // Mock only Firebase external service
    jest
      .spyOn(firebaseMessagingService, 'subscribeToTopic')
      .mockResolvedValue({ success: true, response: {} as MessagingTopicManagementResponse })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    jest.clearAllMocks()
    // Clean up test data
    await userDeviceModel.deleteMany({})
  })

  describe('GET /notifications/user-devices/:fcmToken', () => {
    it('should return user device when token is valid', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/notifications/user-devices/${mockFcmToken}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.fcmToken).toBe(mockFcmToken)
      expect(data.userId).toBe(mockUserId.toString())
      expect(data.userRole).toBe(UserRole.ACCOUNT)
    })

    it('should return 404 when device not found', async () => {
      const nonExistentToken = 'non-existent-token'

      await request(global.app.getHttpServer())
        .get(`/notifications/user-devices/${nonExistentToken}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
    })
  })

  describe('POST /notifications/user-devices', () => {
    const newDeviceToken = 'new-device-token-456'

    it('should create new user device', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .post('/notifications/user-devices')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fcmToken: newDeviceToken,
          browser: 'Firefox',
          os: 'MacOS'
        })
        .expect(201)

      expect(status).toBe(201)
      expect(data.success).toBe(true)

      // Verify device was created in database
      const createdDevice = await userDeviceModel.findOne({ fcmToken: newDeviceToken })
      expect(createdDevice).toBeTruthy()
      expect(createdDevice.fcmToken).toBe(newDeviceToken)
    })
  })
})
