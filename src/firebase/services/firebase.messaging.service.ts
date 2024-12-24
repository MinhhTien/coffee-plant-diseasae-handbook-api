import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { IFirebaseRepository } from '@firebase/repositories/firebase.repository'
import { AppLogger } from '@common/services/app-logger.service'
import {
  SendFirebaseMessagingDto,
  SendFirebaseMulticastMessagingDto,
  SendFirebaseTopicMessagingDto,
  SubscribeFirebaseTopicDto,
  UnsubscribeFirebaseTopicDto
} from '@firebase/dto/firebase-messaging.dto'
import { BatchResponse, MessagingTopicManagementResponse } from 'firebase-admin/lib/messaging/messaging-api'

export const IFirebaseMessagingService = Symbol('IFirebaseMessagingService')

export interface IFirebaseMessagingService {
  send({ token, title, body, data }: SendFirebaseMessagingDto): Promise<{
    success: boolean
    response?: string
  }>
  sendMulticast({ tokens, title, body, data }: SendFirebaseMulticastMessagingDto): Promise<{
    success: boolean
    response?: BatchResponse
  }>
  sendTopicNotification({ topic, title, body, data }: SendFirebaseTopicMessagingDto): Promise<{
    success: boolean
    response?: string
  }>
  subscribeToTopic({ topic, tokens }: SubscribeFirebaseTopicDto): Promise<{
    success: boolean
    response?: MessagingTopicManagementResponse
  }>
  unsubscribeToTopic({ topic, tokens }: UnsubscribeFirebaseTopicDto): Promise<{
    success: boolean
    response?: MessagingTopicManagementResponse
  }>
}

@Injectable()
export class FirebaseMessagingService implements IFirebaseMessagingService {
  private readonly appLogger = new AppLogger(FirebaseMessagingService.name)
  constructor(
    @Inject(IFirebaseRepository)
    private readonly firebaseRepository: IFirebaseRepository
  ) {}

  async send({ token, title, body, data }: SendFirebaseMessagingDto) {
    try {
      const response = await this.firebaseRepository.getMessaging().send({
        token,
        notification: {
          title,
          body
        },
        data
      })
      return {
        success: true,
        response
      }
    } catch (error) {
      this.appLogger.error('Error sending messages:', error)
      return { success: false }
    }
  }

  async sendMulticast({ tokens, title, body, data }: SendFirebaseMulticastMessagingDto) {
    const message = {
      notification: {
        title,
        body
      },
      tokens,
      data
    }

    try {
      const response = await this.firebaseRepository.getMessaging().sendEachForMulticast(message)
      this.appLogger.log(`Successfully sent messages: ${JSON.stringify(response)}`)
      return {
        success: true,
        response
      }
    } catch (error) {
      this.appLogger.error('Error sending messages:', error)
      return { success: false }
    }
  }

  async sendTopicNotification({ topic, title, body, data }: SendFirebaseTopicMessagingDto) {
    const message = {
      notification: {
        title,
        body
      },
      topic,
      data
    }

    try {
      const response = await this.firebaseRepository.getMessaging().send(message)
      this.appLogger.log(`Successfully sent messages: ${JSON.stringify(response)}`)
      return { success: true, response }
    } catch (error) {
      this.appLogger.error('Error sending message:', error)
      return { success: false }
    }
  }

  async subscribeToTopic({ topic, tokens }: SubscribeFirebaseTopicDto) {
    try {
      const response = await this.firebaseRepository.getMessaging().subscribeToTopic(tokens, topic)
      this.appLogger.log(`Successfully subscribed to topic: ${JSON.stringify(response)}`)
      return { success: true, response }
    } catch (error) {
      this.appLogger.error('Error subscribing to topic:', error)
      return { success: false }
    }
  }

  async unsubscribeToTopic({ topic, tokens }: UnsubscribeFirebaseTopicDto) {
    try {
      const response = await this.firebaseRepository.getMessaging().unsubscribeFromTopic(tokens, topic)
      this.appLogger.log(`Successfully unsubscribed to topic: ${JSON.stringify(response)}`)
      return { success: true, response }
    } catch (error) {
      this.appLogger.error('Error unsubscribing to topic:', error)
      return { success: false }
    }
  }
}
