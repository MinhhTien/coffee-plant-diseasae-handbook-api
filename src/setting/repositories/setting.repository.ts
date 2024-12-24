import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Setting, SettingDocument } from '@setting/schemas/setting.schema'
import { AbstractRepository } from '@common/repositories'

export const ISettingRepository = Symbol('ISettingRepository')

export interface ISettingRepository extends AbstractRepository<SettingDocument> {}

@Injectable()
export class SettingRepository extends AbstractRepository<SettingDocument> implements ISettingRepository {
  constructor(@InjectModel(Setting.name) model: PaginateModel<SettingDocument>) {
    super(model)
  }
}
