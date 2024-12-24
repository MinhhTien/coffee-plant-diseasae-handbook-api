import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SignApiOptions, v2 } from 'cloudinary'
import { GenerateSignedUrlDto } from '@media/dto/generate-signed-url.dto'
import * as _ from 'lodash'
import { UploadMediaViaBase64Dto } from '@media/dto/upload-media-via-base64.dto'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { AppLogger } from '@common/services/app-logger.service'

@Injectable()
export class MediaService implements OnModuleInit {
  private readonly appLogger = new AppLogger(MediaService.name)
  constructor(
    private readonly configService: ConfigService,
    @Inject('CLOUDINARY_V2') private readonly cloudinary: typeof v2
  ) {}
  onModuleInit() {
    const config = this.configService.get('cloudinary')
    this.cloudinary.config({ ...config, secure: true })
  }

  public async create(generateSignedUrlDto: GenerateSignedUrlDto) {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = await this.generateSignedUrl({
      ...generateSignedUrlDto,
      timestamp
    })
    return { ...generateSignedUrlDto, timestamp, signature }
  }

  public async uploadViaBase64(uploadMediaViaBase64Dto: UploadMediaViaBase64Dto) {
    try {
      const result = await this.cloudinary.uploader.upload(
        `data:image/png;base64,${uploadMediaViaBase64Dto.contents}`,
        {
          ..._.pick(['type', 'public_id', 'folder'])
        }
      )
      return result
    } catch (err) {
      this.appLogger.error(err)
      throw new AppException(Errors.UPLOAD_MEDIA_ERROR)
    }
  }

  private async generateSignedUrl(params_to_sign: SignApiOptions) {
    return this.cloudinary.utils.api_sign_request(params_to_sign, this.configService.get('cloudinary.api_secret'))
  }

  public async uploadMultiple(images: string[]) {
    const uploadPromises = []
    images.forEach((image) => {
      uploadPromises.push(this.cloudinary.uploader.upload(image))
    })

    const uploadResponses = await Promise.all(uploadPromises)
    this.appLogger.log(JSON.stringify(uploadResponses))
    return uploadResponses
  }
}
