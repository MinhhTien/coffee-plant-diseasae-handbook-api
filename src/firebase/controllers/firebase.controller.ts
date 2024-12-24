import { Controller, UseGuards, Inject, Req, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { IFirebaseAuthService } from '@firebase/services/firebase.auth.service'
import { CreateCustomTokenFirebaseDataResponse } from '@firebase/dto/create-custom-token.firebase.dto'

@ApiTags('Firebase')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.ACCOUNT, UserRole.ACCOUNT)
@Controller()
export class FirebaseController {
  constructor(
    @Inject(IFirebaseAuthService)
    private readonly firebaseService: IFirebaseAuthService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.ACCOUNT}, ${UserRole.ACCOUNT}] Create Custom Token`
  })
  @ApiOkResponse({ type: CreateCustomTokenFirebaseDataResponse })
  @Post('custom-token')
  async createCustomToken(@Req() req) {
    const token = await this.firebaseService.createCustomToken(_.get(req, 'user'))
    return { token }
  }
}
