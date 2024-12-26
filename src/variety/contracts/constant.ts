export const VARIETY_DETAIL_PROJECTION = [
  '_id',
  'name',
  'description',
  'scientificName',
  'origin',
  'distribution',
  'suitableClimate',
  'height',
  'leaf',
  'bean',
  'flavor',
  'image',
  'createdAt',
  'updatedAt'
] as const

export const VARIETY_LIST_PROJECTION = VARIETY_DETAIL_PROJECTION
