export const USER_DEVICE_LIST_PROJECTION = ['_id', 'userId', 'userRole', 'fcmToken', 'status', 'browser', 'os'] as const

export enum FCMNotificationDataType {
  CLASS_REQUEST = 'CLASS_REQUEST',
  PAYOUT_REQUEST = 'PAYOUT_REQUEST',
  RECRUITMENT = 'RECRUITMENT',
  CLASS = 'CLASS',
  SLOT = 'SLOT',
  GARDEN_TIMESHEET = 'GARDEN_TIMESHEET'
}
