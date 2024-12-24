import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Report, ReportDocument } from '@report/schemas/report.schema'
import { AbstractRepository } from '@common/repositories'

export const IReportRepository = Symbol('IReportRepository')

export interface IReportRepository extends AbstractRepository<ReportDocument> {}

@Injectable()
export class ReportRepository extends AbstractRepository<ReportDocument> implements IReportRepository {
  constructor(@InjectModel(Report.name) model: PaginateModel<ReportDocument>) {
    super(model)
  }
}
