import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { MediaResourceType, MediaType } from '@media/contracts/constant'

export class UploadMediaViaBase64Dto {
  @ApiProperty({ type: String, example: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4...' })
  @IsNotEmpty()
  @IsString()
  contents: string

  @ApiProperty({ enum: MediaType })
  @IsOptional()
  @IsEnum(MediaType)
  type: string

  @ApiPropertyOptional({ type: String, example: 'public_id' })
  @IsOptional()
  @IsString()
  public_id: string

  @ApiPropertyOptional({ type: String, example: 'images' })
  @IsOptional()
  @IsString()
  folder: string
}

class UploadMediaViaBase64ResponseDto {
  @ApiProperty({ type: String, example: '15a66cd41cb44ebdc518f767a2fffb52' })
  asset_id: string

  @ApiProperty({ type: String, example: 'images/jlhqjvxdqjshg9xtfvkt' })
  public_id: string

  @ApiPropertyOptional({ type: String, example: 'jpg' })
  format: string

  @ApiProperty({ enum: MediaResourceType })
  resource_type: string

  @ApiPropertyOptional({ type: String, example: '2024-09-14T06:51:27Z' })
  created_at: string

  @ApiProperty({ enum: MediaType })
  type: string

  @ApiProperty({
    type: String,
    example:
      'http://res.cloudinary.com/handbook/image/authenticated/s--hJ8eOb6---/v1726296687/handbook_upload/jlhqjvxdqjshg9xtfvkt.jpg'
  })
  url: string

  @ApiPropertyOptional({ type: String, example: 'images' })
  asset_folder: string
}

export class UploadMediaViaBase64DataResponseDto extends DataResponse(UploadMediaViaBase64ResponseDto) {}
