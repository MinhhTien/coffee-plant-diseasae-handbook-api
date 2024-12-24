import { IAuthUserService } from '@auth/services/auth.service'
import { LearnerStatus } from '@common/contracts/constant'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { ACCOUNT_LIST_PROJECTION } from '@learner/contracts/constant'
import { QueryLearnerDto } from '@learner/dto/view-learner.dto'
import { Injectable, Inject } from '@nestjs/common'
import { ILearnerRepository } from '@src/learner/repositories/learner.repository'
import { Learner, LearnerDocument } from '@src/learner/schemas/learner.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose'

export const ILearnerService = Symbol('ILearnerService')

export interface ILearnerService extends IAuthUserService {
  create(learner: any, options?: SaveOptions | undefined): Promise<LearnerDocument>
  findById(learnerId: string, projection?: string | Record<string, any>): Promise<LearnerDocument>
  findByEmail(email: string, projection?: string | Record<string, any>): Promise<LearnerDocument>
  update(
    conditions: FilterQuery<Learner>,
    payload: UpdateQuery<Learner>,
    options?: QueryOptions | undefined
  ): Promise<LearnerDocument>
  list(pagination: PaginationParams, queryLearnerDto: QueryLearnerDto)
  findMany(
    conditions: FilterQuery<LearnerDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<LearnerDocument[]>
}

@Injectable()
export class LearnerService implements ILearnerService {
  constructor(
    @Inject(ILearnerRepository)
    private readonly learnerRepository: ILearnerRepository
  ) {}

  public create(learner: any, options?: SaveOptions | undefined) {
    return this.learnerRepository.create(learner, options)
  }

  public async findById(learnerId: string, projection?: string | Record<string, any>) {
    const learner = await this.learnerRepository.findOne({
      conditions: {
        _id: learnerId
      },
      projection
    })
    return learner
  }

  public async findByEmail(email: string, projection?: string | Record<string, any>) {
    const learner = await this.learnerRepository.findOne({
      conditions: {
        email
      },
      projection
    })
    return learner
  }

  public update(conditions: FilterQuery<Learner>, payload: UpdateQuery<Learner>, options?: QueryOptions | undefined) {
    return this.learnerRepository.findOneAndUpdate(conditions, payload, options)
  }

  async list(pagination: PaginationParams, queryLearnerDto: QueryLearnerDto, projection = ACCOUNT_LIST_PROJECTION) {
    const { name, email, status } = queryLearnerDto
    const filter: Record<string, any> = {
      status: {
        $ne: LearnerStatus.UNVERIFIED
      }
    }

    const validStatus = status?.filter((status) => [LearnerStatus.ACTIVE, LearnerStatus.INACTIVE].includes(status))
    if (validStatus?.length > 0) {
      filter['status'] = {
        $in: validStatus
      }
    }

    let textSearch = ''
    if (name) textSearch += name.trim()
    if (email) textSearch += ' ' + email.trim()
    if (textSearch) {
      filter['$text'] = {
        $search: textSearch.trim()
      }
    }

    return this.learnerRepository.model.paginate(filter, {
      ...pagination,
      projection
    })
  }

  public async findMany(
    conditions: FilterQuery<LearnerDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const learners = await this.learnerRepository.findMany({
      conditions,
      projection,
      populates
    })
    return learners
  }
}
