import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { createHmac } from 'crypto'
import * as bcrypt from 'bcrypt'
import { Connection, ClientSession } from 'mongoose'
import { Weekday } from '@common/contracts/constant'
import { VN_TIMEZONE } from '@src/config'
import * as moment from 'moment-timezone'
import * as fs from 'fs'
import * as path from 'path'
import * as ejs from 'ejs'
import * as playwright from 'playwright'
import { AppLogger } from './app-logger.service'

export type GeneratePDFResponse = {
  status: boolean
  certificatePath: string
  metadata: object
  error?: string
}

@Injectable()
export class HelperService {
  private readonly appLogger = new AppLogger(HelperService.name)
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async executeCommandsInTransaction(
    fn: (session: ClientSession, data?: Record<string, any>) => Promise<any>,
    data?: Record<string, any>
  ): Promise<any> {
    let result: any
    const session = await this.connection.startSession()
    await session.withTransaction(async () => {
      result = await fn(session, data)
    })
    return result
  }

  createSignature(rawData: string, key: string) {
    const signature = createHmac('sha256', key).update(rawData).digest('hex')
    return signature
  }

  generateRandomString = (length = 6, characters = '0123456789') => {
    let randomString = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomString += characters.charAt(randomIndex)
    }
    return randomString
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    return hash
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  validateWeekdays(weekdays: Weekday[]): boolean {
    if (!weekdays || weekdays.length !== 2) {
      return false
    }

    const validWeekdayTuples = [
      [Weekday.MONDAY, Weekday.THURSDAY],
      [Weekday.TUESDAY, Weekday.FRIDAY],
      [Weekday.WEDNESDAY, Weekday.SATURDAY]
    ]

    return validWeekdayTuples.some((tuple) => weekdays[0] === tuple[0] && weekdays[1] === tuple[1])
  }

  convertDataToPaging({
    docs,
    totalDocs,
    limit,
    page
  }: {
    docs: Array<any>
    totalDocs: number
    limit: number
    page: number
  }) {
    const totalPages = totalDocs < limit ? 1 : Math.ceil(totalDocs / limit)
    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages,
      pagingCounter: null,
      hasPrevPage: page > totalPages,
      hasNextPage: page < totalPages,
      prevPage: page - 1 === 0 ? null : page - 1,
      nextPage: page < totalPages ? page + 1 : null
    }
  }

  getDiffTimeByMilliseconds(date: Date): number {
    const diffTime = moment.tz(date, VN_TIMEZONE).diff(moment().tz(VN_TIMEZONE), 'milliseconds')
    return diffTime > 0 ? diffTime : 0
  }

  async generatePDF(params: {
    data: {
      learnerName: string
      courseTitle: string
      dateCompleted: string
      certificateCode: string
      instructorName: string
      instructorSignature?: string
    }
    templatePath?: string
    certificatePath?: string
    metadata?: object
  }): Promise<GeneratePDFResponse> {
    const {
      data,
      templatePath = './templates/learner/certificate.ejs',
      certificatePath = 'certs/certificate.pdf',
      metadata = {}
    } = params
    this.appLogger.debug(`[generatePDF]: templatePath=${templatePath}, data=${JSON.stringify(data)}`)
    try {
      const fileName = path.resolve(__dirname, '../../', templatePath)
      // Compile EJS template
      const templateContent = fs.readFileSync(fileName, 'utf-8')
      const compiledTemplate = ejs.compile(templateContent, { async: true })

      // Render HTML content using the template
      const htmlContent = await compiledTemplate(data)

      // Launch browser
      const browser = await playwright.chromium.launch()

      // Create a new browser context
      const context = await browser.newContext()

      // Create a new page
      const page = await context.newPage()

      // Set HTML content directly using setContent
      await page.setContent(htmlContent)

      // Generate PDF from HTML
      await page.pdf({
        path: certificatePath, // Specify the path to save the PDF file
        format: 'A4', // Specify the page format,

        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '10mm',
          bottom: '10mm',
          left: '0',
          right: '0',
        }
      })

      // Close the browser
      await browser.close()

      this.appLogger.log(`[generatePDF]: PDF file generated successfully.`)
      return { status: true, certificatePath, metadata }
    } catch (error) {
      this.appLogger.error(
        `[generatePDF]: error templatePath=${templatePath}, data=${JSON.stringify(data)}, error=${error}`
      )
      return { error: error.name, status: false, certificatePath, metadata }
    }
  }
}
