import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AbstractRepository } from '@common/repositories'
import { UserToken, UserTokenDocument } from '@auth/schemas/user-token.schema'

export const IUserTokenRepository = Symbol('IUserTokenRepository')

export interface IUserTokenRepository extends AbstractRepository<UserTokenDocument> {}

@Injectable()
export class UserTokenRepository extends AbstractRepository<UserTokenDocument> implements IUserTokenRepository {
  constructor(@InjectModel(UserToken.name) model: PaginateModel<UserTokenDocument>) {
    super(model)
  }
}
