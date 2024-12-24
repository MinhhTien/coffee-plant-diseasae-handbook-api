import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Learner, LearnerSchema } from '@src/learner/schemas/learner.schema'
import { ILearnerRepository, LearnerRepository } from '@src/learner/repositories/learner.repository'
import { ILearnerService, LearnerService } from '@src/learner/services/learner.service'
import { LearnerController } from '@src/learner/controllers/learner.controller'
import { ManagementLearnerController } from './controllers/management.learner.controller'
import { InstructorLearnerController } from './controllers/instructor.learner.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Learner.name, schema: LearnerSchema }])],
  // controllers: [LearnerController, ManagementLearnerController, InstructorLearnerController],
  // controllers: [LearnerController, ManagementLearnerController],
  providers: [
    {
      provide: ILearnerService,
      useClass: LearnerService
    },
    {
      provide: ILearnerRepository,
      useClass: LearnerRepository
    }
  ],
  exports: [
    {
      provide: ILearnerService,
      useClass: LearnerService
    }
  ]
})
export class LearnerModule {}
