import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { INotificationService, NotificationService } from '@notification/services/notification.service'
import { IUserDeviceService, UserDeviceService } from './services/user-device.service'
import { IUserDeviceRepository, UserDeviceRepository } from './repositories/user-device.repository'
import { UserDeviceController } from './controllers/user-device.controller'
import { FirebaseModule } from '@firebase/firebase.module'
import { UserDevice, UserDeviceSchema } from './schemas/user-device.schema'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDevice.name, schema: UserDeviceSchema }
    ]),
    // FirebaseModule
  ],
  // controllers: [UserDeviceController],
  providers: [
    {
      provide: INotificationService,
      useClass: NotificationService
    },
    {
      provide: IUserDeviceService,
      useClass: UserDeviceService
    },
    {
      provide: IUserDeviceRepository,
      useClass: UserDeviceRepository
    }
  ],
  exports: [
    {
      provide: INotificationService,
      useClass: NotificationService
    },
    {
      provide: IUserDeviceService,
      useClass: UserDeviceService
    }
  ]
})
export class NotificationModule {}
