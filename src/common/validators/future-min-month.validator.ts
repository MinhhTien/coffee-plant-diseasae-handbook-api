import { applyDecorators } from '@nestjs/common'
import * as moment from 'moment-timezone'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
  IsDateString
} from 'class-validator'
import { VN_TIMEZONE } from '@src/config'

@ValidatorConstraint({ name: 'futureMinMonth' })
class FutureMinMonthValidator implements ValidatorConstraintInterface {
  validate(value: Date, validationArguments?: ValidationArguments): boolean {
    const now = moment().tz(VN_TIMEZONE)
    const dateMoment = moment(value).tz(VN_TIMEZONE)
    const month = validationArguments.constraints[0] ?? 1

    return dateMoment.subtract(month, 'month').isSameOrAfter(now, 'day')
  }

  defaultMessage(args?: ValidationArguments) {
    const month = args.constraints[0] ?? 1
    return `Date must be after ${month} months from now`
  }
}

export function FutureMinMonth(month: number = 1): PropertyDecorator {
  return applyDecorators(IsDateString({ strict: true }), Validate(FutureMinMonthValidator, [month]))
}
