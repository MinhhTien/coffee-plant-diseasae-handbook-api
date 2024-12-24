export const ACCOUNT_PROFILE_PROJECTION = ['_id', 'name', 'email', 'avatar', 'dateOfBirth', 'phone', 'status'] as const

export const ACCOUNT_DETAIL_PROJECTION = [
  '_id',
  'name',
  'email',
  'avatar',
  'dateOfBirth',
  'phone',
  'status',
  'createdAt',
  'updatedAt'
] as const

export const ACCOUNT_LIST_PROJECTION = ACCOUNT_DETAIL_PROJECTION
