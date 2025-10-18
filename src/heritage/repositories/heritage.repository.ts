import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Heritage, HeritageDocument } from '@src/heritage/schemas/heritage.schema'
import { AbstractRepository } from '@common/repositories'

export const IHeritageRepository = Symbol('IHeritageRepository')

export interface IHeritageRepository  extends AbstractRepository<HeritageDocument> {
}

@Injectable()
export class HeritageRepository extends AbstractRepository<HeritageDocument> implements IHeritageRepository {
  constructor(@InjectModel(Heritage.name) model: PaginateModel<HeritageDocument>) {
    super(model)
  }
}
