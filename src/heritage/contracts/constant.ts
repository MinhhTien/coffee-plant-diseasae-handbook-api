export const HERITAGE_DETAIL_PROJECTION = [
  '_id',
  'name',
  'slug',
  'shortDescription',
  'detailedDescription',
  'type',
  'location',
  'creationTime',
  'origin',
  'typicalValue',
  'image',
  'video',
  'relatedCommunity',
  'createdAt',
  'updatedAt',
  'modelUrl',
  'audioUrl',
] as const

export const HERITAGE_LIST_PROJECTION = HERITAGE_DETAIL_PROJECTION
