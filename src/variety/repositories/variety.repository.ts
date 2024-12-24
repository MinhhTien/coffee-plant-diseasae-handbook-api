import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Variety, VarietyDocument } from '@src/variety/schemas/variety.schema'
import { AbstractRepository } from '@common/repositories'

export const IVarietyRepository = Symbol('IVarietyRepository')

export interface IVarietyRepository  extends AbstractRepository<VarietyDocument> {
}

@Injectable()
export class VarietyRepository extends AbstractRepository<VarietyDocument> implements IVarietyRepository {
  constructor(@InjectModel(Variety.name) model: PaginateModel<VarietyDocument>) {
    super(model)
  }
}
