import { applyDecorators } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
  IsDateString
} from 'class-validator'

@ValidatorConstraint({ name: 'pastYear' })
class PastYearValidator implements ValidatorConstraintInterface {
  validate(value: Date, validationArguments?: ValidationArguments): boolean {
    const now = new Date()
    const yearsAgo = validationArguments.constraints[0] ?? 10

    return now.getFullYear() - new Date(value).getFullYear() >= yearsAgo
  }

  defaultMessage(args?: ValidationArguments) {
    const yearsAgo = args.constraints[0] ?? 10
    return `Date must be older than ${yearsAgo} years from now`
  }
}

export function PastYear(yearsAgo: number = 10): PropertyDecorator {
  return applyDecorators(IsDateString({ strict: true }), Validate(PastYearValidator, [yearsAgo]))
}
