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
import { Heritage } from '@heritage/schemas/heritage.schema'

export class BaseHeritageDto implements Heritage {
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
  @MaxLength(100)
  slug: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  shortDescription: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  detailedDescription: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  type: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsDateString()
  creationTime: Date

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  origin: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  typicalValue: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUrl()
  image: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUrl()
  video: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @MaxLength(200)
  relatedCommunity: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUrl()
  modelUrl: string
}
