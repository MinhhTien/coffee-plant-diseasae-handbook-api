import { UserRole } from '@common/contracts/constant'
import { MediaType } from '@media/contracts/constant'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Types } from 'mongoose'
import * as request from 'supertest'

describe('MediaController (e2e)', () => {
  let accessToken: string
  beforeAll(() => {
    const jwtService = global.rootModule.get(JwtService)
    const configService = global.rootModule.get(ConfigService)

    // Generate access token to be used in the tests
    accessToken = jwtService.sign(
      {
        sub: new Types.ObjectId().toString(),
        role: UserRole.ACCOUNT
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )
  })
  describe('POST /media', () => {
    it('should upload a file', async () => {
      await request(global.app.getHttpServer())
        .post('/media')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ type: MediaType.upload })
        .expect(201)
    })
  })

  describe('POST /media/upload/base64', () => {
    it('should upload a base64 file', async () => {
      await request(global.app.getHttpServer())
        .post('/media/upload/base64')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ contents: 'filecontentabcxyz' })
        .expect(201)
    })
  })
})
