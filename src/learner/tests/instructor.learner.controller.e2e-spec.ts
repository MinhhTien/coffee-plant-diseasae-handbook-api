import { LearnerStatus, UserRole } from '@common/contracts/constant'
import { Model, Types } from 'mongoose'
import { Errors } from '@common/contracts/error'
import { getModelToken } from '@nestjs/mongoose'
import { Learner } from '@learner/schemas/learner.schema'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as request from 'supertest'

describe('InstructorLearnerController (e2e)', () => {
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
        sub: new Types.ObjectId().toString(),
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

  describe('GET /learners/instructor/:id', () => {
    it('should return learner detail', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .get(`/learners/instructor/${learnerTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(status).toBe(200)
      expect(body.data).toHaveProperty('_id', learnerTestData._id.toString())
    })

    it('should throw error if learner not found', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .get(`/learners/instructor/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(status).toBe(404)
      expect(body.error).toBe(Errors.ACCOUNT_NOT_FOUND.error)
    })
  })
})
