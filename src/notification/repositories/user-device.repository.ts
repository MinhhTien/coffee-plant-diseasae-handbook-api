import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { UserDevice, UserDeviceDocument } from '@notification/schemas/user-device.schema'
import { AbstractRepository } from '@common/repositories'

export const IUserDeviceRepository = Symbol('IUserDeviceRepository')

export interface IUserDeviceRepository extends AbstractRepository<UserDeviceDocument> {}

@Injectable()
export class UserDeviceRepository extends AbstractRepository<UserDeviceDocument> implements IUserDeviceRepository {
  constructor(@InjectModel(UserDevice.name) model: PaginateModel<UserDeviceDocument>) {
    super(model)
  }
}
