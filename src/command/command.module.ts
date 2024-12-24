import { Module } from '@nestjs/common'
import { SeederCommand } from './seeder.command'
import { ReportModule } from '@report/report.module'

@Module({
  imports: [ReportModule],
  providers: [SeederCommand],
  exports: [SeederCommand]
})
export class CommandModule {}
