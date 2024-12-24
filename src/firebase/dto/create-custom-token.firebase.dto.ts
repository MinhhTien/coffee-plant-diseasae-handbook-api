import { ApiProperty } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'

class CreateCustomTokenFirebaseResponse {
  @ApiProperty({ type: String })
  token: string
}
export class CreateCustomTokenFirebaseDataResponse extends DataResponse(CreateCustomTokenFirebaseResponse) {}