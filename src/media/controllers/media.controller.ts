import { Controller, UseGuards, Body, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ErrorResponse } from '@common/contracts/dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { MediaService } from '@media/services/media.service'
import { GenerateSignedUrlDataResponse, GenerateSignedUrlDto } from '@media/dto/generate-signed-url.dto'
import { UploadMediaViaBase64DataResponseDto, UploadMediaViaBase64Dto } from '@media/dto/upload-media-via-base64.dto'

@ApiTags('Media')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN)
@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiOperation({
    summary: `Generating authentication signatures`
  })
  @ApiCreatedResponse({ type: GenerateSignedUrlDataResponse })
  @Post()
  generateSignedURL(@Body() generateSignedUrlDto: GenerateSignedUrlDto) {
    return this.mediaService.create(generateSignedUrlDto)
  }

  @ApiOperation({
    summary: `Upload Media Via Base64`
  })
  @ApiCreatedResponse({ type: UploadMediaViaBase64DataResponseDto })
  @Post('upload/base64')
  uploadViaBase64(@Body() uploadMediaViaBase64Dto: UploadMediaViaBase64Dto) {
    return this.mediaService.uploadViaBase64(uploadMediaViaBase64Dto)
  }
}
