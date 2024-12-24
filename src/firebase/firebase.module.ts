import { Module } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { FirebaseRepository, IFirebaseRepository } from './repositories/firebase.repository'
import { FirebaseController } from './controllers/firebase.controller'
import { FirebaseAuthService, IFirebaseAuthService } from './services/firebase.auth.service'
import { LearnerModule } from '@learner/learner.module'
import { FirebaseMessagingService, IFirebaseMessagingService } from './services/firebase.messaging.service'
import { FirebaseFirestoreService, IFirebaseFirestoreService } from './services/firebase.firestore.service'
import { ConfigService } from '@nestjs/config'

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const firebaseConfig = ((await configService.get('firebase')) || {}) as admin.ServiceAccount

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
    })
  }
}

@Module({
  imports: [LearnerModule],
  // controllers: [FirebaseController],
  providers: [
    // firebaseProvider,
    // {
    //   provide: IFirebaseRepository,
    //   useClass: FirebaseRepository
    // },
    // {
    //   provide: IFirebaseAuthService,
    //   useClass: FirebaseAuthService
    // },
    // {
    //   provide: IFirebaseMessagingService,
    //   useClass: FirebaseMessagingService
    // },
    // {
    //   provide: IFirebaseFirestoreService,
    //   useClass: FirebaseFirestoreService
    // }
  ],
  exports: [
    // {
    //   provide: IFirebaseAuthService,
    //   useClass: FirebaseAuthService
    // },
    // {
    //   provide: IFirebaseMessagingService,
    //   useClass: FirebaseMessagingService
    // },
    // {
    //   provide: IFirebaseFirestoreService,
    //   useClass: FirebaseFirestoreService
    // }
  ]
})
export class FirebaseModule {}
