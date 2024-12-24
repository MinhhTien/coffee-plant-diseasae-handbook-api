import { TestBed, Mocked } from '@suites/unit'
import { FilterQuery, UpdateQuery, Types } from 'mongoose'
import { UserRole } from '@common/contracts/constant'
import { CreateUserTokenDto } from '@auth/dto/user-token.dto'
import { UserTokenDocument } from '@auth/schemas/user-token.schema'
import { UserTokenService } from '@auth/services/user-token.service'
import { IUserTokenRepository } from '@auth/repositories/user-token.repository'

describe('UserTokenService', () => {
  let userTokenService: UserTokenService
  let userTokenRepository: Mocked<IUserTokenRepository>
  const mockUserToken = {
    _id: '_id',
    userId: new Types.ObjectId(),
    role: UserRole.ACCOUNT,
    refreshToken: 'refreshToken',
    enabled: true
  } as UserTokenDocument

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserTokenService).compile()
    userTokenService = unit
    userTokenRepository = unitRef.get(IUserTokenRepository)
  })

  it('should create a user token', async () => {
    const createUserTokenDto: CreateUserTokenDto = {
      userId: new Types.ObjectId(),
      role: UserRole.ACCOUNT,
      refreshToken: 'refreshToken'
    }
    const expectedUserToken = mockUserToken

    userTokenRepository.create.mockResolvedValue(expectedUserToken)

    const result = await userTokenService.create(createUserTokenDto)

    expect(result).toEqual(expectedUserToken)
    expect(userTokenRepository.create).toHaveBeenCalled()
  })

  it('should update a user token', async () => {
    const conditions: FilterQuery<any> = {
      userId: new Types.ObjectId(),
      role: UserRole.ACCOUNT
    }
    const payload: UpdateQuery<any> = {
      refreshToken: 'newRefreshToken'
    }
    const expectedUserToken = {
      ...mockUserToken,
      refreshToken: 'newRefreshToken'
    } as UserTokenDocument

    userTokenRepository.findOneAndUpdate.mockResolvedValue(expectedUserToken)

    const result = await userTokenService.update(conditions, payload)

    expect(result).toEqual(expectedUserToken)
    expect(userTokenRepository.findOneAndUpdate).toHaveBeenCalled()
  })

  it('should find a user token by refresh token', async () => {
    const refreshToken = 'refresh_token_123'
    const expectedUserToken = {
      ...mockUserToken,
      refreshToken
    } as UserTokenDocument

    userTokenRepository.findOne.mockResolvedValue(expectedUserToken)

    const result = await userTokenService.findByRefreshToken(refreshToken)

    expect(result).toEqual(expectedUserToken)
    expect(userTokenRepository.findOne).toHaveBeenCalled()
  })

  it('should disable a user token by refresh token', async () => {
    const refreshToken = 'refresh_token_123'
    const expectedUserToken = {
      ...mockUserToken,
      refreshToken
    } as UserTokenDocument

    userTokenRepository.findOneAndUpdate.mockResolvedValue(expectedUserToken)

    const result = await userTokenService.disableRefreshToken(refreshToken)

    expect(result).toEqual(expectedUserToken)
    expect(userTokenRepository.findOneAndUpdate).toHaveBeenCalled()
  })

  it('should clear all refresh tokens of a user', async () => {
    userTokenRepository.deleteMany.mockResolvedValue({ acknowledged: true, deletedCount: 1 })

    await userTokenService.clearAllRefreshTokensOfUser(mockUserToken.userId, mockUserToken.role)

    expect(userTokenRepository.deleteMany).toHaveBeenCalled()
  })
})
