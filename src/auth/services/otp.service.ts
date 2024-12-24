import { Injectable, Inject } from '@nestjs/common'
import { FilterQuery, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose'
import { IOtpRepository } from '@auth/repositories/otp.repository'
import { Otp, OtpDocument } from '@auth/schemas/otp.schema'
import { CreateOtpDto } from '@auth/dto/otp.dto'
import { UserRole } from '@common/contracts/constant'

export const IOtpService = Symbol('IOtpService')

export interface IOtpService {
  create(createOtpDto: CreateOtpDto, options?: SaveOptions | undefined): Promise<OtpDocument>
  update(
    conditions: FilterQuery<Otp>,
    payload: UpdateQuery<Otp>,
    options?: QueryOptions | undefined
  ): Promise<OtpDocument>
  findByCode(code: string): Promise<OtpDocument>
  findByUserIdAndRole(userId: string, role: UserRole): Promise<OtpDocument>
  clearOtp(code: string): void
}

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    @Inject(IOtpRepository)
    private readonly otpRepository: IOtpRepository
  ) {}

  public create(createOtpDto: CreateOtpDto, options?: SaveOptions | undefined): Promise<OtpDocument> {
    return this.otpRepository.create(createOtpDto, options)
  }

  public update(
    conditions: FilterQuery<Otp>,
    payload: UpdateQuery<Otp>,
    options?: QueryOptions | undefined
  ): Promise<OtpDocument> {
    return this.otpRepository.findOneAndUpdate(conditions, payload, options)
  }

  public findByCode(code: string): Promise<OtpDocument> {
    return this.otpRepository.findOne({
      conditions: {
        code
      }
    })
  }

  findByUserIdAndRole(userId: string, role: UserRole): Promise<OtpDocument> {
    return this.otpRepository.findOne({
      conditions: {
        userId,
        role
      }
    })
  }

  async clearOtp(code: string) {
    await this.otpRepository.model.deleteOne({
      code
    })
    return
  }
}
