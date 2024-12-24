import { UserRole } from '@common/contracts/constant'
import { IFirebaseRepository } from '@firebase/repositories/firebase.repository'
import { FirebaseAuthService } from '@firebase/services/firebase.auth.service'
import { InstructorDocument } from '@instructor/schemas/instructor.schema'
import { IInstructorService } from '@instructor/services/instructor.service'
import { LearnerDocument } from '@learner/schemas/learner.schema'
import { ILearnerService } from '@learner/services/learner.service'
import { Mocked } from '@suites/doubles.jest'
import { TestBed } from '@suites/unit'
import { Auth } from 'firebase-admin/lib/auth/auth'
import { Types } from 'mongoose'

describe('FirebaseAuthService', () => {
  let firebaseAuthService: FirebaseAuthService
  let instructorService: Mocked<IInstructorService>
  let learnerService: Mocked<ILearnerService>
  let firebaseRepository: Mocked<IFirebaseRepository>

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(FirebaseAuthService).compile()
    firebaseAuthService = unit
    instructorService = unitRef.get(IInstructorService)
    learnerService = unitRef.get(ILearnerService)
    firebaseRepository = unitRef.get(IFirebaseRepository)
  })

  describe('createCustomToken', () => {
    it('should create custom token for instructor', async () => {
      firebaseRepository.getAuth.mockReturnValue({
        getUser: (_) => Promise.reject(new Error('auth/user-not-found')),
        createUser: (_) => Promise.resolve({}),
        createCustomToken: (_) => Promise.resolve('token')
      } as Auth)

      instructorService.findById.mockResolvedValueOnce({
        _id: 'id',
        name: 'name',
        email: 'email',
        avatar: 'avatar'
      } as InstructorDocument)

      await firebaseAuthService.createCustomToken({ _id: new Types.ObjectId().toString(), role: UserRole.ACCOUNT })
    })

    it('should create custom token for learner', async () => {
      firebaseRepository.getAuth.mockReturnValue({
        getUser: (_) => Promise.reject(new Error('auth/user-not-found')),
        createUser: (_) => Promise.resolve({}),
        createCustomToken: (_) => Promise.resolve('token')
      } as Auth)

      learnerService.findById.mockResolvedValueOnce({
        _id: 'id',
        name: 'name',
        email: 'email',
        avatar: 'avatar'
      } as LearnerDocument)

      await firebaseAuthService.createCustomToken({ _id: new Types.ObjectId().toString(), role: UserRole.ACCOUNT })
    })

    it('create custom token for existing user', async () => {
      firebaseRepository.getAuth.mockReturnValue({
        getUser: (_) => Promise.resolve({}),
        createUser: (_) => Promise.resolve({}),
        createCustomToken: (_) => Promise.resolve('token')
      } as Auth)

      const result = await firebaseAuthService.createCustomToken({
        _id: new Types.ObjectId().toString(),
        role: UserRole.ACCOUNT
      })
      expect(result).toBe('token')
    })
  })
})
