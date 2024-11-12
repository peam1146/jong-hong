import {
  PENALTY_GAPI_SERVICE_NAME,
  PenaltyGapiClient,
} from '@jong-hong/grpc/nestjs/proto/penalty/penalty';
import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

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

  @Get('/:userId')
  async isPenalized(@Param('userId') userId: string) {
    return lastValueFrom(this.penaltyServiceClient.isUserPenalized({ userId }));
  }
}
