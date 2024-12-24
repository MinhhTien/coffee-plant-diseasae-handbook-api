import { Injectable, Inject } from '@nestjs/common'
import { ISettingRepository } from '@setting/repositories/setting.repository'
import { Setting, SettingDocument } from '@setting/schemas/setting.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose'
import * as _ from 'lodash'
import { SettingKey } from '@setting/contracts/constant'

export const ISettingService = Symbol('ISettingService')

export interface ISettingService {
  findById(
    settingId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<SettingDocument>
  findByKey(
    key: SettingKey,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<SettingDocument>
  update(
    conditions: FilterQuery<Setting>,
    payload: UpdateQuery<Setting>,
    options?: QueryOptions | undefined
  ): Promise<SettingDocument>
}

@Injectable()
export class SettingService implements ISettingService {
  constructor(
    @Inject(ISettingRepository)
    private readonly settingRepository: ISettingRepository
  ) {}

  public async findById(
    settingId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const setting = await this.settingRepository.findOne({
      conditions: {
        _id: settingId
      },
      projection,
      populates
    })
    return setting
  }

  public async findByKey(key: SettingKey, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>) {
    const setting = await this.settingRepository.findOne({
      conditions: {
        key
      },
      projection,
      populates
    })
    return setting
  }

  public update(conditions: FilterQuery<Setting>, payload: UpdateQuery<Setting>, options?: QueryOptions | undefined) {
    return this.settingRepository.findOneAndUpdate(conditions, payload, options)
  }
}
