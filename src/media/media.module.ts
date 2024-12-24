import { Module } from '@nestjs/common'
import { MediaController } from './controllers/media.controller'
import { MediaService } from './services/media.service'
import { v2 } from 'cloudinary'

const cloudinaryProvider = {
  provide: 'CLOUDINARY_V2',
  useFactory: () => v2
}

@Module({
  imports: [],
  // controllers: [MediaController],
  providers: [MediaService, cloudinaryProvider],
  exports: [MediaService]
})
export class MediaModule {}
