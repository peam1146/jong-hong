import {
  PENALTY_GAPI_SERVICE_NAME,
  PenaltyGapiClient,
} from '@jong-hong/grpc/nestjs/proto/penalty/penalty';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { getProfile } from '../utils/profile';

@Controller('penalty')
export class PenaltyController {
  private penaltyServiceClient: PenaltyGapiClient;
  constructor(
    @Inject(PENALTY_GAPI_SERVICE_NAME) private penaltyClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.penaltyServiceClient =
      this.penaltyClient.getService<PenaltyGapiClient>(
        PENALTY_GAPI_SERVICE_NAME,
      );
  }

  @Get('/')
  async isPenalized(@Req() req) {
    const profile = await getProfile(req);
    try {
      await lastValueFrom(
        this.penaltyServiceClient.isUserPenalized({ userId: profile._id }),
      );
      return false;
    } catch (e) {
      return true;
    }
  }

  //Debug
  @Post('/:userId')
  async penalize(
    @Param('userId') userId: string,
    @Body() body: { penaltyTime: number; causedBy: string },
  ) {
    return lastValueFrom(
      this.penaltyServiceClient.insertPenalty({
        userId,
        penaltyTime: body.penaltyTime,
        causedBy: body.causedBy,
      }),
    );
  }
}
