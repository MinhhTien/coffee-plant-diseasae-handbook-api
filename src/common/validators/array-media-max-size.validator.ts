import { MediaResourceType } from '@media/contracts/constant'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { applyDecorators } from '@nestjs/common'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsArray,
  Validate
} from 'class-validator'

@ValidatorConstraint({ name: 'arrayMediaMaxSize' })
class ArrayMediaMaxSizeValidator implements ValidatorConstraintInterface {
  validate(value: BaseMediaDto[], validationArguments?: ValidationArguments): boolean {
    const { max, resource_type } = validationArguments.constraints[0]
    const valueByType = value?.filter((item: BaseMediaDto) => item.resource_type === resource_type) || []
    return valueByType.length <= max
  }

  defaultMessage(args?: ValidationArguments) {
    const { max, resource_type } = args.constraints[0]
    return `Number of ${resource_type} must be not bigger than ${max}.`
  }
}

export function ArrayMediaMaxSize(max: number, resource_type: MediaResourceType): PropertyDecorator {
  return applyDecorators(IsArray(), Validate(ArrayMediaMaxSizeValidator, [{ max, resource_type }]))
}
