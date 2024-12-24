import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MediaResourceType, MediaType } from '@media/contracts/constant'

export class BaseMediaDto {
  @ApiProperty({ type: String, example: '15a66cd41cb44ebdc518f767a2fffb52' })
  @IsNotEmpty()
  @IsString()
  asset_id: string

  @ApiProperty({ type: String, example: 'images/hcgbmek4qa8kksw2zrcg' })
  @IsNotEmpty()
  @IsString()
  public_id: string

  @ApiProperty({ enum: MediaResourceType })
  @IsEnum(MediaResourceType)
  resource_type: string

  @ApiProperty({ enum: MediaType })
  @IsEnum(MediaType)
  type: string

  @ApiProperty({
    type: String,
    example: 'https://res.cloudinary.com/handbook/image/upload/v1726377866/hcgbmek4qa8kksw2zrcg.jpg'
  })
  @IsNotEmpty()
  @IsString()
  url: string

  @ApiPropertyOptional({ type: String, example: 'jpg' })
  @IsOptional()
  @IsString()
  format: string

  @ApiPropertyOptional({ type: String, example: '2024-09-14T06:51:27Z' })
  @IsOptional()
  @IsString()
  created_at: string

  @ApiPropertyOptional({ type: String, example: 'images' })
  @IsOptional()
  @IsString()
  asset_folder: string

  @ApiPropertyOptional({ type: String, example: 'IMG_0207' })
  @IsOptional()
  @IsString()
  original_filename: string

  @ApiPropertyOptional({ type: String, example: 'JPG' })
  @IsOptional()
  @IsString()
  original_extension: string
}
