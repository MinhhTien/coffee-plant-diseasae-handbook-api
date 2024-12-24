import { UserRole } from '@common/contracts/constant'
import { IFirebaseAuthService } from '@firebase/services/firebase.auth.service'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Types } from 'mongoose'
import * as request from 'supertest'

describe('FirebaseController (e2e)', () => {
  let firebaseAuthService: IFirebaseAuthService
  let accessToken: string

  beforeAll(async () => {
    firebaseAuthService = global.rootModule.get(IFirebaseAuthService)
    const jwtService = global.rootModule.get(JwtService)
    const configService = global.rootModule.get(ConfigService)

    // Create valid access token
    accessToken = jwtService.sign(
      {
        sub: new Types.ObjectId().toString(),
        role: UserRole.ACCOUNT
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test data

    // Mock only Firebase external service
    jest.spyOn(firebaseAuthService, 'createCustomToken').mockResolvedValue('mocked-firebase-token')
  })

  afterAll(async () => {
    jest.clearAllMocks()
  })

  describe('POST /firebase/custom-token', () => {
    it('should return custom token', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .post('/firebase/custom-token')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(status).toBe(201)
      expect(body.data).toMatchObject({ token: 'mocked-firebase-token' })
    })
  })
})
