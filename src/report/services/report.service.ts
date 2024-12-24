import { Injectable, Inject } from '@nestjs/common'
import { IReportRepository } from '@report/repositories/report.repository'
import { Report, ReportDocument } from '@report/schemas/report.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose'
import * as _ from 'lodash'
import { ReportType } from '@report/contracts/constant'

export const IReportService = Symbol('IReportService')

export interface IReportService {
  createMany(createReportDto: any[], options?: SaveOptions | undefined): Promise<ReportDocument[]>
  findById(
    reportId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<ReportDocument>
  findByType(
    type: ReportType,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<ReportDocument>
  findOne(
    conditions: FilterQuery<Report>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<ReportDocument>
  update(
    conditions: FilterQuery<Report>,
    payload: UpdateQuery<Report>,
    options?: QueryOptions | undefined
  ): Promise<ReportDocument>
  findMany(
    conditions: FilterQuery<ReportDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<ReportDocument[]>
}

@Injectable()
export class ReportService implements IReportService {
  constructor(
    @Inject(IReportRepository)
    private readonly reportRepository: IReportRepository
  ) {}

  public async createMany(createManyReportDto: any[], options?: SaveOptions | undefined) {
    const reports = await this.reportRepository.model.insertMany(createManyReportDto, options)

    return reports
  }

  public async findById(
    reportId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const report = await this.reportRepository.findOne({
      conditions: {
        _id: reportId
      },
      projection,
      populates
    })
    return report
  }

  public async findByType(
    type: ReportType,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const report = await this.reportRepository.findOne({
      conditions: {
        type
      },
      projection,
      populates
    })
    return report
  }

  public async findOne(
    conditions: FilterQuery<Report>,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const report = await this.reportRepository.findOne({
      conditions,
      projection,
      populates
    })
    return report
  }

  public update(conditions: FilterQuery<Report>, payload: UpdateQuery<Report>, options?: QueryOptions | undefined) {
    return this.reportRepository.findOneAndUpdate(conditions, payload, options)
  }

  public async findMany(
    conditions: FilterQuery<ReportDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const reports = await this.reportRepository.findMany({
      conditions,
      projection,
      populates
    })
    return reports
  }
}
