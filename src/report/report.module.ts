import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ReportService, IReportService } from './services/report.service'
import { ReportRepository, IReportRepository } from './repositories/report.repository'
import { Report, ReportSchema } from './schemas/report.schema'
import { ReportController } from './controllers/management.report.controller'
import { VarietyModule } from '@variety/variety.module'
import { DiseaseModule } from '@disease/disease.module'
import { HeritageModule } from '@heritage/heritage.module'
// import { InstructorReportController } from './controllers/instructor.report.controller'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]), VarietyModule, DiseaseModule, HeritageModule],
  controllers: [ReportController],
  providers: [
    {
      provide: IReportService,
      useClass: ReportService
    },
    {
      provide: IReportRepository,
      useClass: ReportRepository
    }
  ],
  exports: [
    {
      provide: IReportService,
      useClass: ReportService
    }
  ]
})
export class ReportModule {}
