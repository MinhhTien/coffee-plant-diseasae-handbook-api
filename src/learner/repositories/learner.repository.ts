import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Learner, LearnerDocument } from '@src/learner/schemas/learner.schema'
import { AbstractRepository } from '@common/repositories'

export const ILearnerRepository = Symbol('ILearnerRepository')

export interface ILearnerRepository  extends AbstractRepository<LearnerDocument> {
}

@Injectable()
export class LearnerRepository extends AbstractRepository<LearnerDocument> implements ILearnerRepository {
  constructor(@InjectModel(Learner.name) model: PaginateModel<LearnerDocument>) {
    super(model)
  }
}
