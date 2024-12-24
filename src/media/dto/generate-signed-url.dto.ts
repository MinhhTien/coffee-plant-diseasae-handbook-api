import { Equals, IsEnum, IsIn, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MediaType } from '@media/contracts/constant'
import { DataResponse } from '@common/contracts/openapi-builder'

export class GenerateSignedUrlDto {
  @ApiProperty({ enum: MediaType })
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

  @ApiPropertyOptional({ type: String, example: 'uw' })
  @IsOptional()
  @IsString()
  @Equals('uw')
  source: 'uw'

  @ApiPropertyOptional({ type: String, example: 'upload_preset' })
  @IsOptional()
  @IsString()
  upload_preset: string
}

class GenerateSignedUrlResponse extends GenerateSignedUrlDto {
  @ApiProperty({ type: String, example: '1726296279' })
  timestamp: string

  @ApiProperty({ type: String, example: 'e360bd525b6fbc21bceedbe7d5a9f9a9e0e155e4' })
  signature: string
}

export class GenerateSignedUrlDataResponse extends DataResponse(GenerateSignedUrlResponse) {}

// {
//   "asset_id": "15a66cd41cb44ebdc518f767a2fffb52",
//   "public_id": "handbook_upload/jlhqjvxdqjshg9xtfvkt",
//   "signature": "61e1614d8758f9d11a419a1a714083b65f2bb6cd",
//   "width": 750,
//   "height": 1125,
//   "format": "jpg",
//   "resource_type": "image",
//   "created_at": "2024-09-14T06:51:27Z",
//   "type": "authenticated",
//   "url": "http://res.cloudinary.com/handbook/image/authenticated/s--hJ8eOb6---/v1726296687/handbook_upload/jlhqjvxdqjshg9xtfvkt.jpg",
//   "secure_url": "https://res.cloudinary.com/handbook/image/authenticated/s--hJ8eOb6---/v1726296687/handbook_upload/jlhqjvxdqjshg9xtfvkt.jpg",
//   "asset_folder": "handbook_upload",
//   "display_name": "jlhqjvxdqjshg9xtfvkt",
//   "access_mode": "public",
//   "original_filename": "IMG_0207",
//   "original_extension": "JPG"
// }
