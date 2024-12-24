import { IFirebaseRepository } from '@firebase/repositories/firebase.repository'

describe('FirebaseRepository', () => {
  let firebaseRepository: IFirebaseRepository

  beforeEach(async () => {
    firebaseRepository = global.rootModule.get(IFirebaseRepository)
  })

  describe('getAuth', () => {
    it('should return firebase auth', () => {
      const result = firebaseRepository.getAuth()
      expect(result).toBeDefined()
    })
  })

  describe('getFirestore', () => {
    it('should return firebase firestore', () => {

      const result = firebaseRepository.getFirestore()
      expect(result).toBeDefined()
    })
  })

  describe('getMessaging', () => {
    it('should return firebase messaging', () => {
      const result = firebaseRepository.getMessaging()
      expect(result).toBeDefined()
    })
  })

  describe('getCollection', () => {
    it('should return firebase collection', () => {
      const collectionName = 'test'

      const result = firebaseRepository.getCollection(collectionName)
      expect(result).toBeDefined()
    })
  })
})
