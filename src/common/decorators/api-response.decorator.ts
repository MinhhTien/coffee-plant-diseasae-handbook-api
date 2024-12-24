import { applyDecorators } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { omit as _omit } from 'lodash'
import { ErrorResponse } from '@common/exceptions/app.exception'

export function ApiErrorResponse(errorResponses?: ErrorResponse[] ) {
  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = []

  const errorsMap = new Map<number, ErrorResponse[]>()
  errorResponses?.forEach((errorResponse) => {
    const errors = errorsMap.get(errorResponse.httpStatus)
    if (!errors) {
      errorsMap.set(errorResponse.httpStatus, [errorResponse])
    } else errors.push(errorResponse)
  })

  errorsMap.forEach((value, key) => {
    decorators.push(
      ApiResponse({
        status: key,
        description: key.toString(),
        content: {
          'application/json': {
            examples: value.reduce((list, schema) => {
              list[schema.error] = { value: schema }
              list[schema.error] = { value: _omit(schema, 'httpStatus') }
              return list
            }, {})
          }
        }
      })
    )
  })

  return applyDecorators(...decorators)
}
