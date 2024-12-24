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

@ValidatorConstraint({ name: 'arrayMediaMinSize' })
class ArrayMediaMinSizeValidator implements ValidatorConstraintInterface {
  validate(value: BaseMediaDto[], validationArguments?: ValidationArguments): boolean {
    const { min, resource_type } = validationArguments.constraints[0]
    const mediaByType = value?.filter((item: BaseMediaDto) => item.resource_type === resource_type) || []
    return mediaByType.length >= min
  }

  defaultMessage(args?: ValidationArguments) {
    const { min, resource_type } = args.constraints[0]
    return `Number of ${resource_type} must be not smaller than ${min}.`
  }
}

export function ArrayMediaMinSize(min: number, resource_type: MediaResourceType): PropertyDecorator {
  return applyDecorators(IsArray(), Validate(ArrayMediaMinSizeValidator, [{ min, resource_type }]))
}
