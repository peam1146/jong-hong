import {
  RoomHealthServiceController,
  PingRequest,
  PingResponse,
  RoomHealthServiceControllerMethods,
} from '@jong-hong/grpc/nestjs/proto/room/health';
import { Controller } from '@nestjs/common';

@Controller()
@RoomHealthServiceControllerMethods()
export class HealthController implements RoomHealthServiceController {
  ping(request: PingRequest): PingResponse {
    return {
      message: request.message,
    };
  }
}
