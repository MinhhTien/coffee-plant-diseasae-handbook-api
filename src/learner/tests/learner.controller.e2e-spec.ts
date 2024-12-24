import { LearnerStatus, UserRole } from '@common/contracts/constant'
import { Model, Types } from 'mongoose'
import { Errors } from '@common/contracts/error'
import { getModelToken } from '@nestjs/mongoose'
import { Learner } from '@learner/schemas/learner.schema'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as request from 'supertest'

describe('LearnerController (e2e)', () => {
  let accessToken: string
  let learnerModel: Model<Learner>
  let learnerTestData = {
    _id: new Types.ObjectId(),
    email: 'learner@gmail.com',
    password: 'aA@123456',
    name: 'Orchidfy Learner',
    avatar: 'avatar',
    status: LearnerStatus.ACTIVE
  }

  beforeAll(async () => {
    learnerModel = global.rootModule.get(getModelToken(Learner.name))
    const jwtService = global.rootModule.get(JwtService)
    const configService = global.rootModule.get(ConfigService)

    // Generate valid refresh token
    accessToken = jwtService.sign(
      {
        sub: learnerTestData._id.toString(),
        role: UserRole.ACCOUNT
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test data
    await learnerModel.create(learnerTestData)
  })

  afterAll(async () => {
    // Clean up test data
    await learnerModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('GET /learners/profile', () => {
    it('should return learner profile', async () => {
      const response = await request(global.app.getHttpServer())
        .get('/learners/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body.data).toHaveProperty('_id', learnerTestData._id.toString())
    })

    it('should return error when learner not found', async () => {
      await learnerModel.deleteMany({})

      const response = await request(global.app.getHttpServer())
        .get('/learners/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)

      expect(response.body.error).toBe(Errors.ACCOUNT_NOT_FOUND.error)
    })
  })
})
