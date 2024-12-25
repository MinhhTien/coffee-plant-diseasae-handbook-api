export const DISEASE_DETAIL_PROJECTION = [
  '_id',
  'name',
  'reason',
  'description',
  'effectedVarieties',
  'symptoms',
  'location',
  'time',
  'preventions',
  'image',
  'createdAt',
  'updatedAt'
] as const

export const DISEASE_LIST_PROJECTION = DISEASE_DETAIL_PROJECTION
