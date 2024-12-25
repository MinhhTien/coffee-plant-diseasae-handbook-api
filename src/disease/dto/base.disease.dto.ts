import {
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidateNested
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Disease } from '@disease/schemas/disease.schema'
import { PreventionType, SymptomLevel } from '@common/contracts/constant'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'
import { BaseVarietyDto } from '@variety/dto/base.variety.dto'

export class BaseSymptomDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  description: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEnum(SymptomLevel)
  level: SymptomLevel
}

export class BaseLocationDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  province: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  description: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  ward: string
}

export class BaseTimeDto {
  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @IsDateString()
  startTime: Date

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @IsDateString()
  endTime: Date

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEnum(SymptomLevel)
  level: SymptomLevel
}

export class BasePreventionDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEnum(PreventionType)
  type: PreventionType

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  F
  @Min(1)
  @Max(5)
  effective: number

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  instruction: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note: string
}

export class BaseDiseaseDto implements Disease {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  reason: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string

  @ApiProperty({ type: BaseVarietyDto, isArray: true })
  @IsNotEmpty()
  effectedVarieties: Types.ObjectId[]

  @ApiProperty({ type: BaseSymptomDto, isArray: true })
  @IsNotEmpty()
  @Type(() => BaseSymptomDto)
  @ValidateNested({ each: true })
  symptoms: BaseSymptomDto[]

  @ApiProperty({ type: BaseLocationDto })
  @IsNotEmpty()
  @Type(() => BaseLocationDto)
  @ValidateNested()
  location: BaseLocationDto

  @ApiProperty({ type: BaseTimeDto })
  @IsNotEmpty()
  @Type(() => BaseTimeDto)
  @ValidateNested()
  time: BaseTimeDto

  @ApiProperty({ type: BasePreventionDto, isArray: true })
  @IsNotEmpty()
  @Type(() => BasePreventionDto)
  @ValidateNested({ each: true })
  preventions: BasePreventionDto[]

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsUrl()
  image: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
