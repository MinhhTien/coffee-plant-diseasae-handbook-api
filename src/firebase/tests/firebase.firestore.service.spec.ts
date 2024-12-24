import { IFirebaseRepository } from '@firebase/repositories/firebase.repository'
import { FirebaseFirestoreService } from '@firebase/services/firebase.firestore.service'
import { Mocked } from '@suites/doubles.jest'
import { TestBed } from '@suites/unit'

describe('FirebaseFirestoreService', () => {
  let firebaseFirestoreService: FirebaseFirestoreService
  let firebaseRepository: Mocked<IFirebaseRepository>

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(FirebaseFirestoreService).compile()
    firebaseFirestoreService = unit
    firebaseRepository = unitRef.get(IFirebaseRepository)
  })

  describe('getCollection', () => {
    it('should get collection', async () => {
      firebaseRepository.getCollection.mockReturnValue({} as any)

      const collection = await firebaseFirestoreService.getCollection('collection')
      expect(collection).toBeDefined()
    })
  })
})
