import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APIEmbedField, WebhookClient } from 'discord.js'

@Injectable()
export class DiscordService {
  webhookClient: WebhookClient
  constructor(private readonly configService: ConfigService) {
    this.webhookClient = new WebhookClient({
      id: this.configService.get('discord.webhookId'),
      token: this.configService.get('discord.webhookToken')
    })
  }

  async sendMessage({ content, fields }: { content?: string; fields?: APIEmbedField[] }) {
    try {
      await this.webhookClient.send({
        content,
        username: `Handbook API Bot`,
        avatarURL: 'https://cdn.pfps.gg/pfps/3323-como.gif',
        embeds: [
          {
            title: `ENV ${this.configService.get('NODE_ENV')}`,
            color: 0x00ffff,
            fields
          }
        ]
      })
    } catch (err) {}
  }
}
