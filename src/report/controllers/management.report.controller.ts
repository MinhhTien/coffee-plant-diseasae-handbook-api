import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { IReportService } from '@report/services/report.service'
import {
  QueryReportByMonthDto,
  QueryReportByWeekDto,
  ReportClassByRateListDataResponse,
  ReportClassByStatusListDataResponse,
  ReportCourseByMonthListDataResponse,
  ReportCourseByRateListDataResponse,
  ReportInstructorByMonthListDataResponse,
  ReportInstructorByStatusListDataResponse,
  ReportLearnerByMonthListDataResponse,
  ReportLearnerByStatusListDataResponse,
  ReportRevenueByMonthListDataResponse,
  ReportStaffByStatusListDataResponse,
  ReportTotalSummaryListDataResponse,
  ReportTransactionByDateListDataResponse,
  ReportUserByMonthListDataResponse
} from '@report/dto/view-report.dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { ClassStatus, InstructorStatus, LearnerStatus, StaffStatus, UserRole } from '@common/contracts/constant'
import { Roles } from '@auth/decorators/roles.decorator'
import { ReportTag, ReportType } from '@report/contracts/constant'
import { VN_TIMEZONE } from '@src/config'
import * as moment from 'moment-timezone'

@ApiTags('Report - Management')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller('management')
export class ManagementReportController {
  constructor(
    @Inject(IReportService)
    private readonly reportService: IReportService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Report Data Total Summary`
  })
  @ApiOkResponse({ type: ReportTotalSummaryListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get('total-summary')
  async viewReportTotalSummary() {
    const reports = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.CourseSum, ReportType.LearnerSum, ReportType.InstructorSum, ReportType.CourseComboSum]
        },
        tag: ReportTag.System
      },
      ['type', 'data']
    )
    return { docs: reports }
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Report User Data By Month`
  })
  @ApiOkResponse({ type: ReportUserByMonthListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get('user-by-month')
  async viewReportUserDataByMonth(@Query() queryReportByMonthDto: QueryReportByMonthDto) {
    const { year = 2024 } = queryReportByMonthDto
    const reports = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.LearnerSumByMonth, ReportType.InstructorSumByMonth]
        },
        tag: ReportTag.System,
        'data.year': year
      },
      ['type', 'data']
    )
    const learnerReport = _.find(reports, { type: ReportType.LearnerSumByMonth })
    const instructorReport = _.find(reports, { type: ReportType.InstructorSumByMonth })

    const docs = []
    if (learnerReport && instructorReport) {
      for (let month = 1; month <= 12; month++) {
        const learner = _.get(learnerReport.data, `${month}`) || { quantity: 0 }
        const instructor = _.get(instructorReport.data, `${month}`) || { quantity: 0 }
        docs.push({
          learner,
          instructor
        })
      }
    }
    return { docs }
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Report Class Data By Status`
  })
  @ApiOkResponse({ type: ReportClassByStatusListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get('class-by-status')
  async viewReportClassDataByStatus() {
    const report = await this.reportService.findOne({ type: ReportType.ClassSum, tag: ReportTag.System }, [
      'type',
      'data'
    ])
    return {
      quantity: report.data.quantity,
      docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
        status: ClassStatus[statusKey],
        quantity: report.data[statusKey].quantity
      }))
    }
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Report Data Total Summary`
  })
  @ApiOkResponse({ type: ReportTotalSummaryListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get('admin/total-summary')
  async adminViewReportTotalSummary() {
    const reports = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.CourseSum, ReportType.LearnerSum, ReportType.InstructorSum, ReportType.RevenueSum]
        },
        tag: ReportTag.System
      },
      ['type', 'data']
    )
    return { docs: reports }
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Report Staff Data By Status`
  })
  @ApiOkResponse({ type: ReportStaffByStatusListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get('admin/staff-by-status')
  async adminViewReportStaffDataByStatus() {
    const report = await this.reportService.findOne({ type: ReportType.StaffSum, tag: ReportTag.System }, [
      'type',
      'data'
    ])
    return {
      quantity: report.data.quantity,
      docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
        status: StaffStatus[statusKey],
        quantity: report.data[statusKey].quantity
      }))
    }
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Report Revenue Data By Month`
  })
  @ApiOkResponse({ type: ReportRevenueByMonthListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get('admin/revenue-by-month')
  async adminViewReportRevenueDataByMonth(@Query() queryReportByMonthDto: QueryReportByMonthDto) {
    const { year = 2024 } = queryReportByMonthDto
    let [revenueSumByMonth] = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.RevenueSumByMonth]
        },
        tag: ReportTag.System,
        'data.year': year
      },
      ['type', 'data']
    )

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

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Report Course Data By Month`
  })
  @ApiOkResponse({ type: ReportCourseByMonthListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get('admin/course-by-month')
  async viewReportCourseDataByMonth(@Query() queryReportByMonthDto: QueryReportByMonthDto) {
    const { year = 2024 } = queryReportByMonthDto
    const reports = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.CourseSumByMonth]
        },
        tag: ReportTag.System,
        'data.year': year
      },
      ['type', 'data']
    )
    const courseReport = _.find(reports, { type: ReportType.CourseSumByMonth })

    const docs = []
    if (courseReport) {
      for (let month = 1; month <= 12; month++) {
        const course = _.get(courseReport.data, `${month}`) || { quantity: 0 }
        docs.push({
          course
        })
      }
    }
    return { docs }
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Report Class Data By Status`
  })
  @ApiOkResponse({ type: ReportClassByStatusListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get('admin/class-by-status')
  async adminViewReportClassDataByStatus() {
    const report = await this.reportService.findOne({ type: ReportType.ClassSum, tag: ReportTag.System }, [
      'type',
      'data'
    ])
    return {
      quantity: report.data.quantity,
      docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
        status: ClassStatus[statusKey],
        quantity: report.data[statusKey].quantity
      }))
    }
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Report Instructor Data By Month`
  })
  @ApiOkResponse({ type: ReportInstructorByMonthListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get('admin/instructor-by-month')
  async viewReportInstructorDataByMonth(@Query() queryReportByMonthDto: QueryReportByMonthDto) {
    const { year = 2024 } = queryReportByMonthDto
    const reports = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.InstructorSumByMonth]
        },
        tag: ReportTag.System,
        'data.year': year
      },
      ['type', 'data']
    )
    const instructorReport = _.find(reports, { type: ReportType.InstructorSumByMonth })

    const docs = []
    if (instructorReport) {
      for (let month = 1; month <= 12; month++) {
        const instructor = _.get(instructorReport.data, `${month}`) || { quantity: 0 }
        docs.push({
          instructor
        })
      }
    }
    return { docs }
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Report Instructor Data By Status`
  })
  @ApiOkResponse({ type: ReportInstructorByStatusListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get('admin/instructor-by-status')
  async adminViewReportInstructorDataByStatus() {
    const report = await this.reportService.findOne({ type: ReportType.InstructorSum, tag: ReportTag.System }, [
      'type',
      'data'
    ])
    return {
      quantity: report.data.quantity,
      docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
        status: InstructorStatus[statusKey],
        quantity: report.data[statusKey].quantity
      }))
    }
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Report Learner Data By Month`
  })
  @ApiOkResponse({ type: ReportLearnerByMonthListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get('admin/learner-by-month')
  async viewReportLearnerDataByMonth(@Query() queryReportByMonthDto: QueryReportByMonthDto) {
    const { year = 2024 } = queryReportByMonthDto
    const reports = await this.reportService.findMany(
      {
        type: {
          $in: [ReportType.LearnerSumByMonth]
        },
        tag: ReportTag.System,
        'data.year': year
      },
      ['type', 'data']
    )
    const learnerReport = _.find(reports, { type: ReportType.LearnerSumByMonth })

    const docs = []
    if (learnerReport) {
      for (let month = 1; month <= 12; month++) {
        const learner = _.get(learnerReport.data, `${month}`) || { quantity: 0 }
        docs.push({
          learner
        })
      }
    }
    return { docs }
  }

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}] View Report Learner Data By Status`
  })
  @ApiOkResponse({ type: ReportLearnerByStatusListDataResponse })
  @Roles(UserRole.ACCOUNT)
  @Get('admin/learner-by-status')
  async adminViewReportLearnerDataByStatus() {
    const report = await this.reportService.findOne({ type: ReportType.LearnerSum, tag: ReportTag.System }, [
      'type',
      'data'
    ])
    return {
      quantity: report.data.quantity,
      docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
        status: LearnerStatus[statusKey],
        quantity: report.data[statusKey].quantity
      }))
    }
  }
}
