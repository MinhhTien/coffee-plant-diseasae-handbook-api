import { AppLogger } from '@common/services/app-logger.service'
import { Inject } from '@nestjs/common'
import { ISettingService } from '@setting/services/setting.service'
import { Command, CommandRunner } from 'nest-commander'

interface BasicCommandOptions {
  string?: string
  boolean?: boolean
  number?: number
}

@Command({ name: 'seed', description: 'A parameter parse' })
export class SeederCommand extends CommandRunner {
  private readonly appLogger = new AppLogger(SeederCommand.name)
  constructor(
    @Inject(ISettingService)
    private readonly settingService: ISettingService
  ) {
    super()
  }

  async run(passedParam: string[], options?: BasicCommandOptions): Promise<void> {
    await this.runWithSettingData()
  }

  async runWithSettingData() {
    this.appLogger.log(`Start Setting Seeder Command`)

    // read data from src\command\data\handbook-db.settings.json
    const settingData = require('src/command/data/handbook-db.settings.json')

    if (settingData.length === 0) {
      this.appLogger.error(`No setting data found`)
      return
    }

    this.appLogger.log(JSON.stringify(settingData))
    const updateSettingPromise = []
    for (const setting of settingData) {
      this.appLogger.log(`Key: ${setting.key}`)
      updateSettingPromise.push(
        this.settingService.update(
          { key: setting.key },
          {
            $set: {
              key: setting.key,
              value: setting.value,
              enabled: setting.enabled
            }
          },
          { upsert: true }
        )
      )
    }
    await Promise.all(updateSettingPromise)

    this.appLogger.log(`Finish Setting Seeder Command`)
  }
}
