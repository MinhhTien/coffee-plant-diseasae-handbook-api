import { Module } from '@nestjs/common'
import { AcceptLanguageResolver, QueryResolver, HeaderResolver, CookieResolver, I18nModule } from 'nestjs-i18n'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { RouterModule } from '@nestjs/core'
import { MailerModule } from '@nestjs-modules/mailer'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'

import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'
import { join } from 'path'
import configuration from '@src/config'
import { CommonModule } from '@common/common.module'
import { LearnerModule } from '@src/learner/learner.module'
import { AuthModule } from '@auth/auth.module'
import { MediaModule } from '@media/media.module'
import { TerminusModule } from '@nestjs/terminus'
import { SettingModule } from '@setting/setting.module'
// import { FirebaseModule } from './firebase/firebase.module'
import { NotificationModule } from '@notification/notification.module'
import { ReportModule } from '@report/report.module'
import { CommandModule } from './command/command.module'
import { VarietyModule } from '@variety/variety.module'
import { ThrottlerModule } from '@nestjs/throttler'

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          includeSubfolders: true,
          watch: true
        }
      }),
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['Accept-Language']),
        new CookieResolver(),
        AcceptLanguageResolver
      ],
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1_000,
        limit: 10
      }
    ]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongodbUri =
          configService.get('NODE_ENV') !== 'test' ? configService.get<string>('mongodbUrl') : global.__MONGODB_URI__

        return {
          uri: mongodbUri
        }
      }
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          secure: configService.get('SMTP_SECURE'),
          auth: {
            user: configService.get('SMTP_USERNAME'),
            pass: configService.get('SMTP_PASSWORD')
          }
        },
        defaults: {
          from: `"${configService.get('SMTP_FROM_NAME')}" <${configService.get('SMTP_FROM_EMAIL')}>`
        },
        template: {
          dir: join(__dirname, '/templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false
          }
        }
      }),
      inject: [ConfigService]
    }),
    RouterModule.register([
      {
        path: 'settings',
        module: SettingModule
      },
      {
        path: 'auth',
        module: AuthModule
      },
      {
        path: 'media',
        module: MediaModule
      },
      {
        path: 'learners',
        module: LearnerModule
      },
      // {
      //   path: 'firebase',
      //   module: FirebaseModule
      // },
      {
        path: 'notifications',
        module: NotificationModule
      },
      {
        path: 'reports',
        module: ReportModule
      },
      {
        path: 'varieties',
        module: VarietyModule
      }
    ]),
    TerminusModule.forRoot({
      errorLogStyle: 'pretty'
    }),
    CommonModule,
    SettingModule,
    MediaModule,
    LearnerModule,
    AuthModule,
    // FirebaseModule,
    NotificationModule,
    ReportModule,
    CommandModule,
    VarietyModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
