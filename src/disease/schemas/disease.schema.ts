import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Transform } from 'class-transformer'
import { BaseLocationDto, BasePreventionDto, BaseSymptomDto, BaseTimeDto } from '@disease/dto/base.disease.dto'
import { Variety } from '@variety/schemas/variety.schema'

export type DiseaseDocument = HydratedDocument<Disease>

@Schema({
  collection: 'diseases',
  timestamps: {
    createdAt: true,
    updatedAt: true
  },
  toJSON: {
    transform(doc, ret) {
      delete ret.__v
    }
  }
})
export class Disease {
  constructor(id?: string) {
    this._id = id
  }
  @Transform(({ value }) => value?.toString())
  _id: string

  @Prop({ type: String, required: true, unique: true })
  name: string

  @Prop({ type: String, required: true })
  reason: string

  @Prop({ type: String })
  description: string

  @Prop({ type: [Types.ObjectId], ref: Variety.name })
  effectedVarieties: Types.ObjectId[]

  @Prop({ type: [BaseSymptomDto] })
  symptoms: BaseSymptomDto[]

  @Prop({ type: BaseLocationDto })
  location: BaseLocationDto

  @Prop({ type: BaseTimeDto })
  time: BaseTimeDto

  @Prop({ type: [BasePreventionDto] })
  preventions: BasePreventionDto[]
}

export const DiseaseSchema = SchemaFactory.createForClass(Disease)

DiseaseSchema.plugin(paginate)
DiseaseSchema.index({ name: 'text', reason: 'text', note: 'text' })
