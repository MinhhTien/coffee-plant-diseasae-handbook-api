import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { AbstractRepository } from '@common/repositories'
import { Otp, OtpDocument } from '@auth/schemas/otp.schema'


export const IOtpRepository = Symbol('IOtpRepository')

export interface IOtpRepository extends AbstractRepository<OtpDocument> {}

@Injectable()
export class OtpRepository extends AbstractRepository<OtpDocument> implements IOtpRepository {
  constructor(@InjectModel(Otp.name) model: PaginateModel<OtpDocument>) {
    super(model)
  }
}
