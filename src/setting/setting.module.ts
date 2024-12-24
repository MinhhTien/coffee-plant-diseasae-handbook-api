import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SettingService, ISettingService } from './services/setting.service'
import { SettingRepository, ISettingRepository } from './repositories/setting.repository'
import { Setting, SettingSchema } from './schemas/setting.schema'
import { SettingController } from './controllers/setting.controller'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }])],
  // controllers: [SettingController],
  providers: [
    {
      provide: ISettingService,
      useClass: SettingService
    },
    {
      provide: ISettingRepository,
      useClass: SettingRepository
    }
  ],
  exports: [
    {
      provide: ISettingService,
      useClass: SettingService
    }
  ]
})
export class SettingModule {}
