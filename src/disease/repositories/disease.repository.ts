import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Disease, DiseaseDocument } from '@src/disease/schemas/disease.schema'
import { AbstractRepository } from '@common/repositories'

export const IDiseaseRepository = Symbol('IDiseaseRepository')

export interface IDiseaseRepository  extends AbstractRepository<DiseaseDocument> {
}

@Injectable()
export class DiseaseRepository extends AbstractRepository<DiseaseDocument> implements IDiseaseRepository {
  constructor(@InjectModel(Disease.name) model: PaginateModel<DiseaseDocument>) {
    super(model)
  }
}
