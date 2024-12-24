import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SendFirebaseMessagingDto {
  @ApiProperty({ type: String })
  token: string

  @ApiProperty({ type: String })
  title: string

  @ApiProperty({ type: String })
  body: string

  @ApiPropertyOptional({ type: Object })
  data?: {
    [key: string]: string
  }
}

export class SendFirebaseMulticastMessagingDto {
  @ApiProperty({ type: String, isArray: true })
  tokens: string[]

  @ApiProperty({ type: String })
  title: string

  @ApiProperty({ type: String })
  body: string

  @ApiPropertyOptional({ type: Object })
  data?: {
    [key: string]: string
  }
}

export class SendFirebaseTopicMessagingDto {
  @ApiProperty({ type: String })
  topic: string

  @ApiProperty({ type: String })
  title: string

  @ApiProperty({ type: String })
  body: string

  @ApiPropertyOptional({ type: Object })
  data?: {
    [key: string]: string
  }
}

export class SubscribeFirebaseTopicDto {
  @ApiProperty({ type: String })
  topic: string

  @ApiProperty({ type: String, isArray: true })
  tokens: string[]
}

export class UnsubscribeFirebaseTopicDto {
  @ApiProperty({ type: String })
  topic: string

  @ApiProperty({ type: String, isArray: true })
  tokens: string[]
}
