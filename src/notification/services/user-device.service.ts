import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { IUserDeviceRepository } from '@notification/repositories/user-device.repository'
import { UserDevice, UserDeviceDocument } from '@notification/schemas/user-device.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose'
import { AppLogger } from '@common/services/app-logger.service'
import { CreateUserDeviceDto } from '@notification/dto/user-device.dto'

export const IUserDeviceService = Symbol('IUserDeviceService')

export interface IUserDeviceService {
  create(createUserDeviceDto: CreateUserDeviceDto, options?: SaveOptions | undefined): Promise<UserDeviceDocument>
  findById(
    userDeviceId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<UserDeviceDocument>
  findByFcmToken(
    fcmToken: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<UserDeviceDocument>
  findOneBy(
    conditions: FilterQuery<UserDevice>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<UserDeviceDocument>
  findMany(
    conditions: FilterQuery<UserDeviceDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<UserDeviceDocument[]>
  update(
    conditions: FilterQuery<UserDevice>,
    payload: UpdateQuery<UserDevice>,
    options?: QueryOptions | undefined
  ): Promise<UserDeviceDocument>
}

@Injectable()
export class UserDeviceService implements IUserDeviceService {
  private readonly appLogger = new AppLogger(UserDeviceService.name)
  constructor(
    @Inject(IUserDeviceRepository)
    private readonly userDeviceRepository: IUserDeviceRepository
  ) {}

  public async create(createUserDeviceDto: CreateUserDeviceDto, options?: SaveOptions | undefined) {
    return await this.userDeviceRepository.create({ ...createUserDeviceDto }, options)
  }

  public async update(
    conditions: FilterQuery<UserDevice>,
    payload: UpdateQuery<UserDevice>,
    options?: QueryOptions | undefined
  ) {
    return await this.userDeviceRepository.findOneAndUpdate(conditions, payload, options)
  }

  public async findById(
    userDeviceId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const userDevice = await this.userDeviceRepository.findOne({
      conditions: {
        _id: userDeviceId
      },
      projection,
      populates
    })
    return userDevice
  }

  public async findByFcmToken(
    fcmToken: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const userDevice = await this.userDeviceRepository.findOne({
      conditions: {
        fcmToken
      },
      projection,
      populates
    })
    return userDevice
  }

  public async findOneBy(
    conditions: FilterQuery<UserDevice>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const userDevice = await this.userDeviceRepository.findOne({
      conditions,
      projection,
      populates
    })
    return userDevice
  }

  public async findMany(
    conditions: FilterQuery<UserDeviceDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const userDevices = await this.userDeviceRepository.findMany({
      conditions,
      projection,
      populates
    })
    return userDevices
  }
}
