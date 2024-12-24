import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Variety, VarietySchema } from '@src/variety/schemas/variety.schema'
import { IVarietyRepository, VarietyRepository } from '@src/variety/repositories/variety.repository'
import { IVarietyService, VarietyService } from '@src/variety/services/variety.service'
import { VarietyController } from '@src/variety/controllers/variety.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Variety.name, schema: VarietySchema }])],
  // controllers: [VarietyController, ManagementVarietyController, InstructorVarietyController],
  controllers: [VarietyController],
  providers: [
    {
      provide: IVarietyService,
      useClass: VarietyService
    },
    {
      provide: IVarietyRepository,
      useClass: VarietyRepository
    }
  ],
  exports: [
    {
      provide: IVarietyService,
      useClass: VarietyService
    }
  ]
})
export class VarietyModule {}
