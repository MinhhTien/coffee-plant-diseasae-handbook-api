import { TestBed, Mocked } from '@suites/unit'
import { Types } from 'mongoose'
import { NotificationService } from '@notification/services/notification.service'
import { IFirebaseFirestoreService } from '@firebase/services/firebase.firestore.service'
import { IFirebaseMessagingService } from '@firebase/services/firebase.messaging.service'
import { IUserDeviceService } from '@notification/services/user-device.service'
import { MailerService } from '@nestjs-modules/mailer'
import { UserDeviceStatus } from '@common/contracts/constant'
import { UserDeviceDocument } from '@notification/schemas/user-device.schema'
import { SendTopicNotificationDto } from '@notification/dto/send-notification.dto'

describe('NotificationService', () => {
  let notificationService: NotificationService
  let firebaseFirestoreService: Mocked<IFirebaseFirestoreService>
  let firebaseMessagingService: Mocked<IFirebaseMessagingService>
  let userDeviceService: Mocked<IUserDeviceService>
  let mailerService: Mocked<MailerService>

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(NotificationService).compile()
    notificationService = unit
    firebaseFirestoreService = unitRef.get(IFirebaseFirestoreService)
    firebaseMessagingService = unitRef.get(IFirebaseMessagingService)
    userDeviceService = unitRef.get(IUserDeviceService)
    mailerService = unitRef.get(MailerService)
  })

  it('should send an email', async () => {
    const mailOptions = {
      to: 'test@example.com',
      subject: 'Test Subject',
      template: 'test-template',
      context: { name: 'Test' }
    }

    mailerService.sendMail.mockResolvedValueOnce(undefined)

    await notificationService.sendMail(mailOptions)

    expect(mailerService.sendMail).toHaveBeenCalledWith(mailOptions)
  })

  it('should send firebase cloud messaging to specific users', async () => {
    const notificationDto = {
      title: 'Test Title',
      body: 'Test Body',
      data: { key: 'value' },
      receiverIds: [new Types.ObjectId().toString()]
    }

    const mockCollection = { add: jest.fn() } as unknown as FirebaseFirestore.CollectionReference
    firebaseFirestoreService.getCollection.mockResolvedValueOnce(mockCollection)

    const mockUserDevices = [{ fcmToken: 'token123', status: UserDeviceStatus.ACTIVE }] as UserDeviceDocument[]
    userDeviceService.findMany.mockResolvedValueOnce(mockUserDevices)

    const mockResponse = { success: true, response: { successCount: 1, responses: [], failureCount: 0 } }
    firebaseMessagingService.sendMulticast.mockResolvedValueOnce(mockResponse)

    const result = await notificationService.sendFirebaseCloudMessaging(notificationDto)

    expect(firebaseFirestoreService.getCollection).toHaveBeenCalledWith('notification')
    expect(userDeviceService.findMany).toHaveBeenCalled()
    expect(firebaseMessagingService.sendMulticast).toHaveBeenCalled()
    expect(result).toEqual(mockResponse)
  })

  it('should send topic-based firebase cloud messaging', async () => {
    const topicNotificationDto: SendTopicNotificationDto = {
      title: 'Test Topic Title',
      body: 'Test Topic Body',
      data: { key: 'value' },
      topic: 'test-topic',
      receiverIds: []
    }

    const mockCollection = { add: jest.fn() } as unknown as FirebaseFirestore.CollectionReference
    firebaseFirestoreService.getCollection.mockResolvedValueOnce(mockCollection)

    const mockResponse = { success: true, response: 'message-id' }
    firebaseMessagingService.sendTopicNotification.mockResolvedValueOnce(mockResponse)

    const result = await notificationService.sendTopicFirebaseCloudMessaging(topicNotificationDto)

    expect(firebaseFirestoreService.getCollection).toHaveBeenCalledWith('notification')
    expect(firebaseMessagingService.sendTopicNotification).toHaveBeenCalled()
    expect(result).toEqual(mockResponse)
  })
  
  it('should handle empty device tokens gracefully', async () => {
    const notificationDto = {
      title: 'Test Title',
      body: 'Test Body',
      data: { key: 'value' },
      receiverIds: [new Types.ObjectId().toString()]
    }

    const mockCollection = { add: jest.fn() } as unknown as FirebaseFirestore.CollectionReference
    firebaseFirestoreService.getCollection.mockResolvedValueOnce(mockCollection)
    userDeviceService.findMany.mockResolvedValueOnce([])

    const result = await notificationService.sendFirebaseCloudMessaging(notificationDto)

    expect(result).toEqual({ success: true })
    expect(firebaseMessagingService.sendMulticast).not.toHaveBeenCalled()
  })
})
