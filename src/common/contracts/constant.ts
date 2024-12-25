export enum UserSide {
  ACCOUNT = 'ACCOUNT',
  INSTRUCTOR = 'INSTRUCTOR',
  MANAGEMENT = 'MANAGEMENT'
}

export enum UserRole {
  ACCOUNT = 'ACCOUNT'
}

export enum TimesheetType {
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  DAY = 'DAY'
}

export enum VarietyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum SymptomLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum SeasonType {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
  WINTER = 'WINTER'
}

export enum PreventionType {
  CHEMISTRY = 'CHEMISTRY',
  BIOLOGY = 'BIOLOGY',
  PHYSICS = 'PHYSICS'
}

export enum LearnerStatus {
  UNVERIFIED = 'UNVERIFIED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum InstructorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum GardenManagerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum GardenStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum RecruitmentStatus {
  PENDING = 'PENDING',
  INTERVIEWING = 'INTERVIEWING',
  SELECTED = 'SELECTED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED'
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED'
}

export enum ClassStatus {
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  DELETED = 'DELETED'
}

export enum VarietyClassStatus {
  ENROLLED = 'ENROLLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  DELETED = 'DELETED'
}

export enum GardenTimesheetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  LOCKED = 'LOCKED',
  NOT_AVAILABLE = 'NOT_AVAILABLE'
}

export enum CourseLevel {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum ClassRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED'
}

export enum TransactionStatus {
  DRAFT = 'DRAFT',
  CAPTURED = 'CAPTURED',
  ERROR = 'ERROR',
  CANCELED = 'CANCELED',
  DELETED = 'DELETED',
  REFUNDED = 'REFUNDED'
}

export enum ClassRequestType {
  PUBLISH_CLASS = 'PUBLISH_CLASS',
  CANCEL_CLASS = 'CANCEL_CLASS'
}

export enum Weekday {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday'
}

export enum SlotNumber {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4
}

export const SLOT_NUMBERS = [1, 2, 3, 4]

export enum SubmissionStatus {
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED'
}

export enum AttendanceStatus {
  NOT_YET = 'NOT_YET',
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT'
}

export enum PayoutRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED'
}

export enum UserDeviceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
