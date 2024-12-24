import { Injectable, Inject } from '@nestjs/common'
import { IUserTokenRepository } from '@auth/repositories/user-token.repository'
import { UserToken } from '@auth/schemas/user-token.schema'
import { FilterQuery, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'
import { CreateUserTokenDto } from '@auth/dto/user-token.dto'
import { UserRole } from '@common/contracts/constant'

export const IUserTokenService = Symbol('IUserTokenService')

export interface IUserTokenService {
  create(createUserTokenDto: CreateUserTokenDto, options?: SaveOptions | undefined): Promise<UserToken>
  update(
    conditions: FilterQuery<UserToken>,
    payload: UpdateQuery<UserToken>,
    options?: QueryOptions | undefined
  ): Promise<UserToken>
  findByRefreshToken(refreshToken: string): Promise<UserToken>
  disableRefreshToken(refreshToken: string): Promise<UserToken>
  clearAllRefreshTokensOfUser(userId: Types.ObjectId, role: UserRole): Promise<void>
}

@Injectable()
export class UserTokenService implements IUserTokenService {
  constructor(
    @Inject(IUserTokenRepository)
    private readonly userTokenRepository: IUserTokenRepository
  ) {}

  public create(createUserTokenDto: CreateUserTokenDto, options?: SaveOptions | undefined): Promise<UserToken> {
    return this.userTokenRepository.create(createUserTokenDto, options)
  }

  public update(
    conditions: FilterQuery<UserToken>,
    payload: UpdateQuery<UserToken>,
    options?: QueryOptions | undefined
  ): Promise<UserToken> {
    return this.userTokenRepository.findOneAndUpdate(conditions, payload, options)
  }

  public async findByRefreshToken(refreshToken: string): Promise<UserToken> {
    const userToken = await this.userTokenRepository.findOne({
      conditions: {
        refreshToken,
        enabled: true
      }
    })
    return userToken
  }

  async disableRefreshToken(refreshToken: string): Promise<UserToken> {
    const userToken = await this.userTokenRepository.findOneAndUpdate(
      {
        refreshToken
      },
      {
        $set: {
          enabled: false
        }
      }
    )
    return userToken
  }

  async clearAllRefreshTokensOfUser(userId: Types.ObjectId, role: UserRole): Promise<void> {
    await this.userTokenRepository.deleteMany({
      userId,
      role
    })
  }
}
