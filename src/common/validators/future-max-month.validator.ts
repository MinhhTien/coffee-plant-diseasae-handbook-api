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

@ValidatorConstraint({ name: 'futureMaxMonth' })
class FutureMaxMonthValidator implements ValidatorConstraintInterface {
  validate(value: Date, validationArguments?: ValidationArguments): boolean {
    const now = moment().tz(VN_TIMEZONE)
    const dateMoment = moment(value).tz(VN_TIMEZONE)
    const month = validationArguments.constraints[0] ?? 1

    return dateMoment.subtract(month, 'month').isSameOrBefore(now, 'day')
  }

  defaultMessage(args?: ValidationArguments) {
    const month = args.constraints[0] ?? 1
    return `Date must be before ${month} months from now`
  }
}

export function FutureMaxMonth(month: number = 1): PropertyDecorator {
  return applyDecorators(IsDateString({ strict: true }), Validate(FutureMaxMonthValidator, [month]))
}
