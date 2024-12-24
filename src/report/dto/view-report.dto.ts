import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseReportDto } from './base.report.dto'
import { DataResponse } from '@common/contracts/openapi-builder'
import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator'
import { ClassStatus, InstructorStatus, LearnerStatus, StaffStatus } from '@common/contracts/constant'
import { Type } from 'class-transformer'

export class QueryReportByMonthDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2024)
  @Max(2024)
  year: number
}

export class QueryReportByWeekDto {
  @ApiProperty({ type: Date, example: '2024-09-20' })
  @IsDateString({ strict: true })
  date: Date
}

// View Report Data Total Summary
class ReportTotalSummaryReportListItemResponse extends PickType(BaseReportDto, ['_id', 'type', 'data']) {}
class ReportTotalSummaryListResponse {
  @ApiProperty({ type: ReportTotalSummaryReportListItemResponse, isArray: true })
  docs: ReportTotalSummaryReportListItemResponse[]
}
export class ReportTotalSummaryListDataResponse extends DataResponse(ReportTotalSummaryListResponse) {}

// View Report User Data By Month
class ReportQuantityResponse {
  @ApiProperty({ type: Number })
  quantity: number
}
class ReportUserByMonthListItemResponse {
  @ApiProperty({ type: ReportQuantityResponse })
  learner: ReportQuantityResponse

  @ApiProperty({ type: ReportQuantityResponse })
  instructor: ReportQuantityResponse
}
class ReportUserByMonthListResponse {
  @ApiProperty({ type: ReportUserByMonthListItemResponse, isArray: true })
  docs: ReportUserByMonthListItemResponse[]
}
export class ReportUserByMonthListDataResponse extends DataResponse(ReportUserByMonthListResponse) {}

// View Report Instructor Data By Month
class ReportInstructorByMonthListItemResponse {
  @ApiProperty({ type: ReportQuantityResponse })
  instructor: ReportQuantityResponse
}
class ReportInstructorByMonthListResponse {
  @ApiProperty({ type: ReportInstructorByMonthListItemResponse, isArray: true })
  docs: ReportInstructorByMonthListItemResponse[]
}
export class ReportInstructorByMonthListDataResponse extends DataResponse(ReportInstructorByMonthListResponse) {}

// View Report Learner Data By Month
class ReportLearnerByMonthListItemResponse {
  @ApiProperty({ type: ReportQuantityResponse })
  learner: ReportQuantityResponse
}
class ReportLearnerByMonthListResponse {
  @ApiProperty({ type: ReportLearnerByMonthListItemResponse, isArray: true })
  docs: ReportLearnerByMonthListItemResponse[]
}
export class ReportLearnerByMonthListDataResponse extends DataResponse(ReportLearnerByMonthListResponse) {}

// View Report Class Data By Status
class ReportClassByStatusListItemResponse {
  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: String, enum: ClassStatus })
  status: ClassStatus
}
class ReportClassByStatusListResponse {
  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: ReportClassByStatusListItemResponse, isArray: true })
  docs: ReportClassByStatusListItemResponse[]
}
export class ReportClassByStatusListDataResponse extends DataResponse(ReportClassByStatusListResponse) {}

// View Report Revenue Data By Month
class ReportRevenueResponse {
  @ApiProperty({ type: Number })
  total: number
}
class ReportRevenueByMonthListItemResponse {
  @ApiProperty({ type: ReportRevenueResponse })
  revenue: ReportRevenueResponse
}
class ReportRevenueByMonthListResponse {
  @ApiProperty({ type: ReportRevenueByMonthListItemResponse, isArray: true })
  docs: ReportRevenueByMonthListItemResponse[]
}
export class ReportRevenueByMonthListDataResponse extends DataResponse(ReportRevenueByMonthListResponse) {}

// View Report Staff Data By Status
class ReportStaffByStatusListItemResponse {
  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: String, enum: StaffStatus })
  status: StaffStatus
}
class ReportStaffByStatusListResponse {
  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: ReportStaffByStatusListItemResponse, isArray: true })
  docs: ReportStaffByStatusListItemResponse[]
}
export class ReportStaffByStatusListDataResponse extends DataResponse(ReportStaffByStatusListResponse) {}

// View Report Transaction Data By Date
class ReportTransactionByDateListItemResponse {
  @ApiProperty({ type: String })
  _id: string

  @ApiProperty({ type: Date })
  date: Date

  @ApiProperty({ type: Number })
  paymentAmount: number

  @ApiProperty({ type: Number })
  payoutAmount: number
}
class ReportTransactionByDateListResponse {
  @ApiProperty({ type: ReportTransactionByDateListItemResponse, isArray: true })
  docs: ReportTransactionByDateListItemResponse[]
}
export class ReportTransactionByDateListDataResponse extends DataResponse(ReportTransactionByDateListResponse) {}

// View Report Transaction Count By Month
class ReportTransactionCountByMonthListItemResponse {
  @ApiProperty({ type: String })
  _id: string

  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: Number })
  month: number
}
class ReportTransactionCountByMonthListResponse {
  @ApiProperty({ type: ReportTransactionCountByMonthListItemResponse, isArray: true })
  docs: ReportTransactionCountByMonthListItemResponse[]
}
export class ReportTransactionCountByMonthListDataResponse extends DataResponse(ReportTransactionCountByMonthListResponse) {}


// View Report Course Data By Month
class ReportCourseByMonthListItemResponse {
  @ApiProperty({ type: ReportQuantityResponse })
  course: ReportQuantityResponse
}
class ReportCourseByMonthListResponse {
  @ApiProperty({ type: ReportCourseByMonthListItemResponse, isArray: true })
  docs: ReportCourseByMonthListItemResponse[]
}
export class ReportCourseByMonthListDataResponse extends DataResponse(ReportCourseByMonthListResponse) {}

class ReportCountResponse {
  @ApiProperty({ type: String })
  _id: string

  @ApiProperty({ type: Number })
  count: number
}
// View Report Course Count By Rate
class ReportCourseByRateListResponse {
  @ApiProperty({ type: ReportCountResponse, isArray: true })
  docs: ReportCountResponse[]
}
export class ReportCourseByRateListDataResponse extends DataResponse(ReportCourseByRateListResponse) {}

// View Report Class Count By Rate
class ReportClassByRateListResponse {
  @ApiProperty({ type: ReportCountResponse, isArray: true })
  docs: ReportCountResponse[]
}
export class ReportClassByRateListDataResponse extends DataResponse(ReportClassByRateListResponse) {}

// View Report Instructor Data By Status
class ReportInstructorByStatusListItemResponse {
  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: String, enum: InstructorStatus })
  status: InstructorStatus
}
class ReportInstructorByStatusListResponse {
  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: ReportInstructorByStatusListItemResponse, isArray: true })
  docs: ReportInstructorByStatusListItemResponse[]
}
export class ReportInstructorByStatusListDataResponse extends DataResponse(ReportInstructorByStatusListResponse) {}


// View Report Learner Data By Status
class ReportLearnerByStatusListItemResponse {
  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: String, enum: LearnerStatus })
  status: LearnerStatus
}
class ReportLearnerByStatusListResponse {
  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: ReportLearnerByStatusListItemResponse, isArray: true })
  docs: ReportLearnerByStatusListItemResponse[]
}
export class ReportLearnerByStatusListDataResponse extends DataResponse(ReportLearnerByStatusListResponse) {}
