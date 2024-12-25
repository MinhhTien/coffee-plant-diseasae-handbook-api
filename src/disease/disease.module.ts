import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Disease, DiseaseSchema } from '@src/disease/schemas/disease.schema'
import { IDiseaseRepository, DiseaseRepository } from '@src/disease/repositories/disease.repository'
import { IDiseaseService, DiseaseService } from '@src/disease/services/disease.service'
import { DiseaseController } from '@src/disease/controllers/disease.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Disease.name, schema: DiseaseSchema }])],
  // controllers: [DiseaseController, ManagementDiseaseController, InstructorDiseaseController],
  controllers: [DiseaseController],
  providers: [
    {
      provide: IDiseaseService,
      useClass: DiseaseService
    },
    {
      provide: IDiseaseRepository,
      useClass: DiseaseRepository
    }
  ],
  exports: [
    {
      provide: IDiseaseService,
      useClass: DiseaseService
    }
  ]
})
export class DiseaseModule {}
