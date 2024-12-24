import { IFirebaseRepository } from '@firebase/repositories/firebase.repository'
import { FirebaseMessagingService } from '@firebase/services/firebase.messaging.service'
import { Mocked } from '@suites/doubles.jest'
import { TestBed } from '@suites/unit'
import { Messaging } from 'firebase-admin/lib/messaging/messaging'

describe('FirebaseMessagingService', () => {
  let firebaseMessagingService: FirebaseMessagingService
  let firebaseRepository: Mocked<IFirebaseRepository>

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(FirebaseMessagingService).compile()
    firebaseMessagingService = unit
    firebaseRepository = unitRef.get(IFirebaseRepository)
  })

  describe('send', () => {
    it('should send message', async () => {
      firebaseRepository.getMessaging.mockReturnValue({ send: (_) => Promise.resolve('success') } as Messaging)

      const result = await firebaseMessagingService.send({ title: 'title', body: 'body', token: 'token' })
      expect(result).toMatchObject({ success: true, response: 'success' })
    })

    it('should fail to send message', async () => {
      firebaseRepository.getMessaging.mockReturnValue({ send: (_) => Promise.reject() } as Messaging)

      const result = await firebaseMessagingService.send({ title: 'title', body: 'body', token: 'token' })
      expect(result).toMatchObject({ success: false })
    })
  })

  describe('sendMulticast', () => {
    it('should send multicast message', async () => {
      firebaseRepository.getMessaging.mockReturnValue({
        sendEachForMulticast: (_) =>
          Promise.resolve({
            responses: [{ success: true }],
            successCount: 1,
            failureCount: 0
          })
      } as Messaging)

      const result = await firebaseMessagingService.sendMulticast({ title: 'title', body: 'body', tokens: ['token'] })
      expect(result).toMatchObject({
        success: true,
        response: { responses: [{ success: true }], successCount: 1, failureCount: 0 }
      })
    })

    it('should fail to send multicast message', async () => {
      firebaseRepository.getMessaging.mockReturnValue({
        sendEachForMulticast: (_) => Promise.reject()
      } as Messaging)

      const result = await firebaseMessagingService.sendMulticast({ title: 'title', body: 'body', tokens: ['token'] })
      expect(result).toMatchObject({ success: false })
    })
  })

  describe('sendTopicNotification', () => {
    it('should send topic notification', async () => {
      firebaseRepository.getMessaging.mockReturnValue({ send: (_) => Promise.resolve('success') } as Messaging)

      const result = await firebaseMessagingService.sendTopicNotification({
        title: 'title',
        body: 'body',
        topic: 'topic'
      })
      expect(result).toMatchObject({ success: true, response: 'success' })
    })

    it('should fail to send topic notification', async () => {
      firebaseRepository.getMessaging.mockReturnValue({ send: (_) => Promise.reject() } as Messaging)

      const result = await firebaseMessagingService.sendTopicNotification({
        title: 'title',
        body: 'body',
        topic: 'topic'
      })
      expect(result).toMatchObject({ success: false })
    })
  })

  describe('subscribeToTopic', () => {
    it('should subscribe to topic', async () => {
      firebaseRepository.getMessaging.mockReturnValue({
        subscribeToTopic: (_, __) => Promise.resolve({ failureCount: 0, successCount: 1 })
      } as Messaging)

      const result = await firebaseMessagingService.subscribeToTopic({ tokens: ['token'], topic: 'topic' })
      expect(result).toMatchObject({ success: true, response: { failureCount: 0, successCount: 1 } })
    })

    it('should fail to subscribe to topic', async () => {
      firebaseRepository.getMessaging.mockReturnValue({ subscribeToTopic: (_, __) => Promise.reject() } as Messaging)

      const result = await firebaseMessagingService.subscribeToTopic({ tokens: ['token'], topic: 'topic' })
      expect(result).toMatchObject({ success: false })
    })
  })

  describe('unsubscribeFromTopic', () => {
    it('should unsubscribe from topic', async () => {
      firebaseRepository.getMessaging.mockReturnValue({
        unsubscribeFromTopic: (_, __) => Promise.resolve({ failureCount: 0, successCount: 1 })
      } as Messaging)

      const result = await firebaseMessagingService.unsubscribeToTopic({ tokens: ['token'], topic: 'topic' })
      expect(result).toMatchObject({ success: true, response: { failureCount: 0, successCount: 1 } })
    })

    it('should fail to unsubscribe from topic', async () => {
      firebaseRepository.getMessaging.mockReturnValue({
        unsubscribeFromTopic: (_, __) => Promise.reject()
      } as Messaging)

      const result = await firebaseMessagingService.unsubscribeToTopic({ tokens: ['token'], topic: 'topic' })
      expect(result).toMatchObject({ success: false })
    })
  })
})
