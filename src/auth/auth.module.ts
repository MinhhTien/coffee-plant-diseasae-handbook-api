import { Global, Module } from '@nestjs/common'
import { JwtAccessStrategy } from '@auth/strategies/jwt-access.strategy'
import { PassportModule } from '@nestjs/passport'
import { LearnerModule } from '@src/learner/learner.module'
import { LearnerAuthController } from '@auth/controllers/learner.auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { JwtRefreshStrategy } from '@auth/strategies/jwt-refresh.strategy'
import { AuthService, IAuthService } from './services/auth.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserToken, UserTokenSchema } from './schemas/user-token.schema'
import { InstructorAuthController } from './controllers/instructor.auth.controller'
import { ManagementAuthController } from './controllers/management.auth.controller'
import { IUserTokenRepository, UserTokenRepository } from './repositories/user-token.repository'
import { IUserTokenService, UserTokenService } from './services/user-token.service'
import { Otp, OtpSchema } from './schemas/otp.schema'
import { IOtpRepository, OtpRepository } from './repositories/otp.repository'
import { IOtpService, OtpService } from './services/otp.service'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserToken.name, schema: UserTokenSchema },
      { name: Otp.name, schema: OtpSchema }
    ]),
    ConfigModule,
    PassportModule,
    JwtModule,
    LearnerModule
  ],
  // controllers: [LearnerAuthController, InstructorAuthController, ManagementAuthController],
  // controllers: [LearnerAuthController],
  providers: [
    {
      provide: IAuthService,
      useClass: AuthService
    },
    {
      provide: IUserTokenService,
      useClass: UserTokenService
    },
    {
      provide: IUserTokenRepository,
      useClass: UserTokenRepository
    },
    {
      provide: IOtpService,
      useClass: OtpService
    },
    {
      provide: IOtpRepository,
      useClass: OtpRepository
    },
    JwtAccessStrategy,
    JwtRefreshStrategy
  ],
  exports: [
    {
      provide: IAuthService,
      useClass: AuthService
    },
    {
      provide: IUserTokenService,
      useClass: UserTokenService
    }
  ]
})
export class AuthModule {}
