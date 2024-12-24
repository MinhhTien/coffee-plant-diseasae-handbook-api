import { IsEnum, IsMongoId, IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { VarietyStatus } from '@common/contracts/constant'
import { Variety } from '@variety/schemas/variety.schema'

export class BaseVarietyDto implements Variety {
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
  description: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  scientificName: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  origin: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  distribution: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  suitableClimate: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  height: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  leaf: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  bean: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  flavor: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsUrl()
  image: string

  @ApiProperty({ type: String, enum: VarietyStatus })
  @IsEnum(VarietyStatus)
  status: VarietyStatus

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
