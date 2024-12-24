import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { IReportService } from '@report/services/report.service'
import {
  QueryReportByMonthDto,
  ReportClassByStatusListDataResponse,
  ReportRevenueByMonthListDataResponse,
  ReportTotalSummaryListDataResponse,
  ReportUserByMonthListDataResponse
} from '@report/dto/view-report.dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { ClassRequestStatus, ClassStatus, CourseStatus, PayoutRequestStatus } from '@common/contracts/constant'
import { ReportTag, ReportType } from '@report/contracts/constant'
import { Types } from 'mongoose'

@ApiTags('Report - Instructor')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
// @Roles(UserRole.ACCOUNT)
@Controller('instructor')
export class InstructorReportController {
  constructor(
    @Inject(IReportService)
    private readonly reportService: IReportService
  ) {}

  @ApiOperation({
    summary: `View Report Data Total Summary`
  })
  @ApiOkResponse({ type: ReportTotalSummaryListDataResponse })
  @Get('total-summary')
  async viewReportTotalSummary(@Req() req) {
    const { _id } = _.get(req, 'user')

    let [reports, requestReports] = await Promise.all([
      this.reportService.findMany(
        {
          type: {
            $in: [ReportType.CourseSum, ReportType.ClassSum, ReportType.RevenueSum]
          },
          tag: ReportTag.User,
          ownerId: new Types.ObjectId(_id)
        },
        ['type', 'data']
      ),
      this.reportService.findMany(
        {
          type: {
            $in: [ReportType.ClassRequestSum, ReportType.PayoutRequestSum]
          },
          tag: ReportTag.User,
          ownerId: new Types.ObjectId(_id)
        },
        ['type', 'data']
      )
    ])
    if (reports.length === 0) {
      const initReports = [
        {
          type: ReportType.CourseSum,
          data: {
            quantity: 0,
            [`${CourseStatus.ACTIVE}`]: {
              quantity: 0
            }
          },
          tag: ReportTag.User,
          ownerId: new Types.ObjectId(_id)
        },
        {
          type: ReportType.ClassSum,
          data: {
            quantity: 0,
            [`${ClassStatus.PUBLISHED}`]: {
              quantity: 0
            },
            [`${ClassStatus.IN_PROGRESS}`]: {
              quantity: 0
            },
            [`${ClassStatus.COMPLETED}`]: {
              quantity: 0
            },
            [`${ClassStatus.CANCELED}`]: {
              quantity: 0
            }
          },
          tag: ReportTag.User,
          ownerId: new Types.ObjectId(_id)
        },
        {
          type: ReportType.RevenueSum,
          data: {
            total: 0
          },
          tag: ReportTag.User,
          ownerId: new Types.ObjectId(_id)
        }
      ]
      reports = await this.reportService.createMany(initReports)
    }

    if (requestReports.length === 0) {
      const initRequestReports = [
        {
          type: ReportType.ClassRequestSum,
          data: {
            quantity: 0,
            [`${ClassRequestStatus.PENDING}`]: {
              quantity: 0
            }
          },
          tag: ReportTag.User,
          ownerId: new Types.ObjectId(_id)
        },
        {
          type: ReportType.PayoutRequestSum,
          data: {
            quantity: 0,
            [`${PayoutRequestStatus.PENDING}`]: {
              quantity: 0
            }
          },
          tag: ReportTag.User,
          ownerId: new Types.ObjectId(_id)
        }
      ]
      requestReports = await this.reportService.createMany(initRequestReports)
    }

    const formatData = []
    formatData.push(reports[0]?.toObject())
    formatData.push(reports[1]?.toObject())

    const classRequestSum = requestReports[0]?.toObject()
    const payoutRequestSum = requestReports[1]?.toObject()
    formatData.push({
      type: 'RequestSum',
      data: {
        quantity: _.get(classRequestSum, 'data.quantity', 0) + _.get(payoutRequestSum, 'data.quantity', 0),
        PENDING: {
          quantity:
            _.get(classRequestSum, 'data.PENDING.quantity', 0) + _.get(payoutRequestSum, 'data.PENDING.quantity', 0)
        }
      }
    })

    formatData.push(reports[2]?.toObject())

    return { docs: formatData }
  }

  @ApiOperation({
    summary: `View Report Class Data By Status`
  })
  @ApiOkResponse({ type: ReportClassByStatusListDataResponse })
  @Get('class-by-status')
  async viewReportClassDataByStatus(@Req() req) {
    const { _id } = _.get(req, 'user')
    let report = await this.reportService.findOne(
      { type: ReportType.ClassSum, tag: ReportTag.User, ownerId: new Types.ObjectId(_id) },
      ['type', 'data']
    )

    if (!report) {
      const initReport = {
        type: ReportType.ClassSum,
        data: {
          quantity: 0,
          [`${ClassStatus.PUBLISHED}`]: {
            quantity: 0
          },
          [`${ClassStatus.IN_PROGRESS}`]: {
            quantity: 0
          },
          [`${ClassStatus.COMPLETED}`]: {
            quantity: 0
          },
          [`${ClassStatus.CANCELED}`]: {
            quantity: 0
          }
        },
        tag: ReportTag.User,
        ownerId: new Types.ObjectId(_id)
      }
      const reports = await this.reportService.createMany([initReport])
      report = reports[0]
    }

    return {
      quantity: report.data.quantity,
      docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
        status: ClassStatus[statusKey],
        quantity: report.data[statusKey].quantity
      }))
    }
  }

  @ApiOperation({
    summary: `View Report Learner Enrolled Data By Month`
  })
  @ApiOkResponse({ type: ReportUserByMonthListDataResponse })
  @Get('learner-enrolled-by-month')
  async viewReportLearnerEnrolledDataByMonth(@Req() req, @Query() queryReportByMonthDto: QueryReportByMonthDto) {
    const { _id } = _.get(req, 'user')
    const { year = 2024 } = queryReportByMonthDto
    let [learnerEnrolledReport] = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.LearnerEnrolledSumByMonth]
        },
        tag: ReportTag.User,
        ownerId: new Types.ObjectId(_id),
        'data.year': year
      },
      ['type', 'data']
    )

    if (!learnerEnrolledReport) {
      const initReport = {
        type: ReportType.LearnerEnrolledSumByMonth,
        data: {
          '1': {
            quantity: 0
          },
          '2': {
            quantity: 0
          },
          '3': {
            quantity: 0
          },
          '4': {
            quantity: 0
          },
          '5': {
            quantity: 0
          },
          '6': {
            quantity: 0
          },
          '7': {
            quantity: 0
          },
          '8': {
            quantity: 0
          },
          '9': {
            quantity: 0
          },
          '10': {
            quantity: 0
          },
          '11': {
            quantity: 0
          },
          '12': {
            quantity: 0
          },
          year: 2024
        },
        tag: ReportTag.User,
        ownerId: new Types.ObjectId(_id)
      }
      const reports = await this.reportService.createMany([initReport])
      learnerEnrolledReport = reports[0]
    }

    const docs = []
    if (learnerEnrolledReport) {
      for (let month = 1; month <= 12; month++) {
        const learner = _.get(learnerEnrolledReport.data, `${month}`) || { quantity: 0 }
        docs.push({
          learner
        })
      }
    }
    return { docs }
  }

  @ApiOperation({
    summary: `View Report Revenue Data By Month`
  })
  @ApiOkResponse({ type: ReportRevenueByMonthListDataResponse })
  @Get('revenue-by-month')
  async viewReportRevenueDataByMonth(@Req() req, @Query() queryReportByMonthDto: QueryReportByMonthDto) {
    const { _id } = _.get(req, 'user')
    const { year = 2024 } = queryReportByMonthDto
    let [revenueSumByMonth] = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.RevenueSumByMonth]
        },
        tag: ReportTag.User,
        ownerId: new Types.ObjectId(_id),
        'data.year': year
      },
      ['type', 'data']
    )

    if (!revenueSumByMonth) {
      const initReport = {
        type: ReportType.RevenueSumByMonth,
        data: {
          '1': {
            total: 0
          },
          '2': {
            total: 0
          },
          '3': {
            total: 0
          },
          '4': {
            total: 0
          },
          '5': {
            total: 0
          },
          '6': {
            total: 0
          },
          '7': {
            total: 0
          },
          '8': {
            total: 0
          },
          '9': {
            total: 0
          },
          '10': {
            total: 0
          },
          '11': {
            total: 0
          },
          '12': {
            total: 0
          },
          year: 2024
        },
        tag: ReportTag.User,
        ownerId: new Types.ObjectId(_id)
      }
      const reports = await this.reportService.createMany([initReport])
      revenueSumByMonth = reports[0]
    }

    const docs = []
    if (revenueSumByMonth) {
      for (let month = 1; month <= 12; month++) {
        const revenue = _.get(revenueSumByMonth.data, `${month}`) || { total: 0 }
        docs.push({
          revenue
        })
      }
    }
    return { docs }
  }
}
