import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { IFirebaseRepository } from '@firebase/repositories/firebase.repository'
import { AppLogger } from '@common/services/app-logger.service'

export const IFirebaseFirestoreService = Symbol('IFirebaseFirestoreService')

export interface IFirebaseFirestoreService {
  getCollection(collectionName: string): Promise<FirebaseFirestore.CollectionReference>
}

@Injectable()
export class FirebaseFirestoreService implements IFirebaseFirestoreService {
  private readonly appLogger = new AppLogger(FirebaseFirestoreService.name)
  constructor(
    @Inject(IFirebaseRepository)
    private readonly firebaseRepository: IFirebaseRepository,
  ) {}

  public async getCollection(collectionName: string): Promise<FirebaseFirestore.CollectionReference> {
    return await this.firebaseRepository.getCollection(collectionName)
  }
}
