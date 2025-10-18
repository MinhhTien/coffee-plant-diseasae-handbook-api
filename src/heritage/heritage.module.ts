import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Heritage, HeritageSchema } from '@src/heritage/schemas/heritage.schema'
import { IHeritageRepository, HeritageRepository } from '@src/heritage/repositories/heritage.repository'
import { IHeritageService, HeritageService } from '@src/heritage/services/heritage.service'
import { HeritageController } from '@src/heritage/controllers/heritage.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Heritage.name, schema: HeritageSchema }])],
  // controllers: [HeritageController, ManagementHeritageController, InstructorHeritageController],
  controllers: [HeritageController],
  providers: [
    {
      provide: IHeritageService,
      useClass: HeritageService
    },
    {
      provide: IHeritageRepository,
      useClass: HeritageRepository
    }
  ],
  exports: [
    {
      provide: IHeritageService,
      useClass: HeritageService
    }
  ]
})
export class HeritageModule {}
