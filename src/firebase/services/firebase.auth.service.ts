import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { IFirebaseRepository } from '@firebase/repositories/firebase.repository'
import { AppLogger } from '@common/services/app-logger.service'
import { UserAuth } from '@common/contracts/dto'
import { ILearnerService } from '@learner/services/learner.service'
import { UserRole } from '@common/contracts/constant'

export const IFirebaseAuthService = Symbol('IFirebaseAuthService')

export interface IFirebaseAuthService {
  createCustomToken(userAuth: UserAuth): Promise<string>
}

@Injectable()
export class FirebaseAuthService implements IFirebaseAuthService {
  private readonly appLogger = new AppLogger(FirebaseAuthService.name)
  constructor(
    @Inject(IFirebaseRepository)
    private readonly firebaseRepository: IFirebaseRepository,
    @Inject(ILearnerService)
    private readonly learnerService: ILearnerService
  ) {}

  public async createCustomToken(userAuth: UserAuth): Promise<string> {
    const { _id, role } = userAuth
    try {
      await this.firebaseRepository.getAuth().getUser(_id)
    } catch (error) {
      this.appLogger.error(error.name)
      if (role === UserRole.ACCOUNT) {
        const learner = await this.learnerService.findById(_id)
        await this.firebaseRepository.getAuth().createUser({
          uid: _id,
          displayName: learner.name,
          email: learner.email,
          photoURL: learner.avatar
        })
      }
    }

    return await this.firebaseRepository.getAuth().createCustomToken(_id)
  }
}
