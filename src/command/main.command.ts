import { CommandFactory } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { CommandModule } from './command.module';
const commanderLogger = new Logger('Commander');

async function bootstrap() {
  await CommandFactory.run(AppModule, {
    errorHandler: (err) => {
      commanderLogger.error(err);
    },
  });
}

bootstrap();
