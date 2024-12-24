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

@ValidatorConstraint({ name: 'futureMinDay' })
class FutureMinDayValidator implements ValidatorConstraintInterface {
  validate(value: Date, validationArguments?: ValidationArguments): boolean {
    const now = moment().tz(VN_TIMEZONE)
    const dateMoment = moment(value).tz(VN_TIMEZONE)
    const day = validationArguments.constraints[0] ?? 1

    return dateMoment.subtract(day, 'day').isSameOrAfter(now, 'day')
  }

  defaultMessage(args?: ValidationArguments) {
    const day = args.constraints[0] ?? 1
    return `Date must be after ${day} days from now`
  }
}

export function FutureMinDay(month: number = 1): PropertyDecorator {
  return applyDecorators(IsDateString({ strict: true }), Validate(FutureMinDayValidator, [month]))
}
